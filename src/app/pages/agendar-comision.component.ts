import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgendaService } from '../services/agenda.service';
import { AgendaEvent } from '../models/agenda-event.model';
import { CalendarComponent } from '../components/calendar/calendar.component';
import { EventDialogComponent, EventDialogData } from '../components/event-dialog/event-dialog.component';

@Component({
  selector: 'app-agendar-comision',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    CalendarComponent,
  ],
  templateUrl: './agendar-comision.component.html',
  styleUrl: './agendar-comision.component.scss',
})
export class AgendarComisionComponent {
  private readonly agenda = inject(AgendaService);
  private readonly dialog = inject(MatDialog);

  readonly events = this.agenda.events;

  readonly selectedDate = signal<Date | null>(null);
  readonly selectedEvent = signal<AgendaEvent | null>(null);

  get selectedDateEvents(): AgendaEvent[] {
    const date = this.selectedDate();
    if (!date) return [];
    const dateStr = this._formatDate(date);
    return this.events().filter((e) => e.date === dateStr);
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
