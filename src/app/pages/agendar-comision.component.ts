import { Component, inject, signal, OnInit } from '@angular/core';
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
import { AgendaCrudService, AgendaSearchFilters } from '../services/agenda-crud.service';

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
export class AgendarComisionComponent implements OnInit {
  private readonly agenda = inject(AgendaService);
  private readonly agendaCrud = inject(AgendaCrudService);
  private readonly dialog = inject(MatDialog);
  private readonly formConfig = inject(FormConfigService);

  readonly fields: FormFieldConfig[] = this.formConfig.getAgendaSearchFields();
  readonly events = this.agenda.events;

  readonly showCalendar = signal(false);
  readonly selectedDate = signal<Date | null>(null);
  readonly selectedEvent = signal<AgendaEvent | null>(null);

  ngOnInit(): void {
    this.agenda.loadEvents();
  }

  // --- Search results ---
  buscado = false;
  resultados: ComisionRow[] = [];
  displayedColumns = ['id', 'tipo', 'asignadaA', 'estado', 'fechaCreacion'];

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

    const filters: AgendaSearchFilters = {};
    if (fechaDesde) filters.dateFrom = this._formatDate(fechaDesde);
    if (fechaHasta) filters.dateTo = this._formatDate(fechaHasta);
    if (tipo) filters.type = this._tipoToValue(tipo);
    if (asignadaA) filters.assignedTo = asignadaA;
    if (estado) filters.status = this._estadoToValue(estado);

    this.agendaCrud.getAll(filters).subscribe({
      next: (data) => {
        this.resultados = data.map((e) => ({
          id: e.id.substring(0, 8),
          tipo: e.type.description,
          asignadaA: e.assignedTo ?? '',
          estado: e.status.description,
          fechaCreacion: e.date,
        }));
      },
      error: () => {
        this.resultados = [];
      },
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

  private _tipoToValue(tipo: string): number {
    const map: Record<string, number> = { Normal: 0, Extemporanea: 1, 'Extra Oficial': 2 };
    return map[tipo] ?? 0;
  }

  private _estadoToValue(estado: string): number {
    const map: Record<string, number> = { Pendiente: 0, Confirmada: 1, Cancelada: 2 };
    return map[estado] ?? 0;
  }
}
