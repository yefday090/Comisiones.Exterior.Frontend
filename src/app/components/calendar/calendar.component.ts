import { Component, input, output, signal, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { AgendaEvent } from '../../models/agenda-event.model';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: AgendaEvent[];
}

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const WEEKDAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

@Component({
  selector: 'app-calendar',
  imports: [MatButtonModule, MatCardModule, MatTooltipModule, MatIconModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  readonly events = input<AgendaEvent[]>([]);
  readonly daySelected = output<Date>();
  readonly eventClick = output<AgendaEvent>();

  readonly currentMonth = signal(new Date());

  readonly weeks = computed<CalendarDay[][]>(() => {
    const now = new Date();
    const view = this.currentMonth();
    const year = view.getFullYear();
    const month = view.getMonth();

    const firstDay = new Date(year, month, 1);
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const startDate = new Date(year, month, 1 - startOffset);
    const evts = this.events();
    const weeks: CalendarDay[][] = [];

    for (let w = 0; w < 6; w++) {
      const week: CalendarDay[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + w * 7 + d);

        const dateStr = this._formatDate(date);
        const dayEvents = evts.filter((e) => e.date === dateStr);

        week.push({
          date: new Date(date),
          isCurrentMonth: date.getMonth() === month,
          isToday: this._isSameDay(date, now),
          events: dayEvents,
        });
      }
      weeks.push(week);
    }

    return weeks;
  });

  readonly monthLabel = computed(() => {
    const view = this.currentMonth();
    return `${MONTHS_ES[view.getMonth()]} ${view.getFullYear()}`;
  });

  readonly weekdays = WEEKDAYS_ES;

  prevMonth(): void {
    this.currentMonth.update((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth(): void {
    this.currentMonth.update((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  selectDay(day: CalendarDay): void {
    this.daySelected.emit(day.date);
  }

  selectEvent(event: AgendaEvent): void {
    this.eventClick.emit(event);
  }

  private _isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  private _formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
