import { Component, inject, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgendaService } from '../services/agenda.service';
import { AgendaEvent } from '../models/agenda-event.model';
import { FormFieldConfig } from '../models/form-field.model';
import { FormConfigService } from '../services/form-config.service';
import { CalendarComponent } from '../components/calendar/calendar.component';
import { DynamicSearchFormComponent } from '../components/dynamic-search-form/dynamic-search-form.component';
import { EventDialogComponent, EventDialogData } from '../components/event-dialog/event-dialog.component';

interface ComisionRow {
  id: string;
  tipo: string;
  asignadaA: string;
  estado: string;
  fechaCreacion: string;
}

@Component({
  selector: 'app-agendar-comision',
  imports: [
    NgIf,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatTooltipModule,
    CalendarComponent,
    DynamicSearchFormComponent,
  ],
  templateUrl: './agendar-comision.component.html',
  styleUrl: './agendar-comision.component.scss',
})
export class AgendarComisionComponent {
  private readonly agenda = inject(AgendaService);
  private readonly dialog = inject(MatDialog);
  private readonly formConfig = inject(FormConfigService);

  readonly fields: FormFieldConfig[] = this.formConfig.getSearchFields();
  readonly events = this.agenda.events;

  readonly showCalendar = signal(false);
  readonly selectedDate = signal<Date | null>(null);
  readonly selectedEvent = signal<AgendaEvent | null>(null);

  // --- Search results ---
  buscado = false;
  resultados: ComisionRow[] = [];
  displayedColumns = ['id', 'tipo', 'asignadaA', 'estado', 'fechaCreacion'];

  private readonly datosMock: ComisionRow[] = [
    { id: 'COM-001', tipo: 'Normal', asignadaA: 'Carlos Pérez', estado: 'Radicada', fechaCreacion: '2026-05-01' },
    { id: 'COM-002', tipo: 'Extemporanea', asignadaA: 'María López', estado: 'Asignada', fechaCreacion: '2026-04-28' },
    { id: 'COM-003', tipo: 'Extra Oficial', asignadaA: 'Juan Ríos', estado: 'Terminada', fechaCreacion: '2026-04-15' },
    { id: 'COM-004', tipo: 'Normal', asignadaA: 'Ana Torres', estado: 'Asignada', fechaCreacion: '2026-05-05' },
    { id: 'COM-005', tipo: 'Normal', asignadaA: 'Carlos Pérez', estado: 'Radicada', fechaCreacion: '2026-05-08' },
  ];

  get selectedDateEvents(): AgendaEvent[] {
    const date = this.selectedDate();
    if (!date) return [];
    const dateStr = this._formatDate(date);
    return this.events().filter((e) => e.date === dateStr);
  }

  toggleCalendar(): void {
    this.showCalendar.update((v) => !v);
  }

  onSearch(values: Record<string, any>): void {
    this.buscado = true;

    const fechaDesde = values['fechaCreacion_desde'] as Date | null;
    const fechaHasta = values['fechaCreacion_hasta'] as Date | null;
    const tipo = values['tipo'] as string;
    const asignadaA = values['asignadaA'] as string;
    const estado = values['estado'] as string;

    this.resultados = this.datosMock.filter((d) => {
      const fechaOk =
        (!fechaDesde || d.fechaCreacion >= this._formatDate(fechaDesde)) &&
        (!fechaHasta || d.fechaCreacion <= this._formatDate(fechaHasta));
      const tipoOk = !tipo || d.tipo === tipo;
      const asignadoOk = !asignadaA || d.asignadaA.toLowerCase().includes(asignadaA.toLowerCase());
      const estadoOk = !estado || d.estado === estado;
      return fechaOk && tipoOk && asignadoOk && estadoOk;
    });
  }

  onClear(): void {
    this.buscado = false;
    this.resultados = [];
  }

  onDaySelected(date: Date): void {
    this.selectedDate.set(date);
    this.selectedEvent.set(null);
  }

  onEventClick(event: AgendaEvent): void {
    this.selectedEvent.set(event);
  }

  openNewEvent(): void {
    const ref = this.dialog.open<EventDialogComponent, EventDialogData, AgendaEvent | null>(
      EventDialogComponent,
      { data: { event: null } }
    );
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.agenda.addEvent(result);
      }
    });
  }

  openEditEvent(event: AgendaEvent): void {
    const ref = this.dialog.open<EventDialogComponent, EventDialogData, AgendaEvent | null>(
      EventDialogComponent,
      { data: { event } }
    );
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.agenda.updateEvent(result);
        this.selectedEvent.set(result);
      }
    });
  }

  deleteEvent(event: AgendaEvent): void {
    if (confirm(`¿Eliminar "${event.title}"?`)) {
      this.agenda.deleteEvent(event.id);
      if (this.selectedEvent()?.id === event.id) {
        this.selectedEvent.set(null);
      }
    }
  }

  private _formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
