import { Component, input, output, signal, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
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
  imports: [MatButtonModule, MatCardModule, MatTooltipModule, MatIconModule, MatButtonToggleModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  readonly events = input<AgendaEvent[]>([]);
  readonly daySelected = output<Date>();
  readonly eventClick = output<AgendaEvent>();

  readonly viewMode = signal<'month' | 'week'>('month');
  readonly currentMonth = signal(new Date());
  readonly currentWeekStart = signal(this._getWeekStart(new Date()));

  readonly weeks = computed<CalendarDay[][]>(() => {
    const now = new Date();
    const evts = this.events();

    if (this.viewMode() === 'week') {
      return [this._buildWeek(this.currentWeekStart(), evts, now)];
    }

    // Month view
    const view = this.currentMonth();
    const year = view.getFullYear();
    const month = view.getMonth();

    const firstDay = new Date(year, month, 1);
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const startDate = new Date(year, month, 1 - startOffset);
    const weeks: CalendarDay[][] = [];

    for (let w = 0; w < 6; w++) {
      const week: CalendarDay[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + w * 7 + d);

        const dateStr = this._formatDate(date);
        week.push({
          date: new Date(date),
          isCurrentMonth: date.getMonth() === month,
          isToday: this._isSameDay(date, now),
          events: evts.filter((e) => e.date === dateStr),
        });
      }
      weeks.push(week);
    }

    return weeks;
  });

  readonly headerLabel = computed(() => {
    if (this.viewMode() === 'week') {
      const start = this.currentWeekStart();
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.getDate()} ${MONTHS_ES[start.getMonth()]} — ${end.getDate()} ${MONTHS_ES[end.getMonth()]} ${end.getFullYear()}`;
    }
    const view = this.currentMonth();
    return `${MONTHS_ES[view.getMonth()]} ${view.getFullYear()}`;
  });

  readonly weekdays = WEEKDAYS_ES;

  setView(mode: 'month' | 'week'): void {
    this.viewMode.set(mode);
  }

  prev(): void {
    if (this.viewMode() === 'week') {
      this.currentWeekStart.update((d) => {
        const n = new Date(d);
        n.setDate(n.getDate() - 7);
        return n;
      });
    } else {
      this.currentMonth.update((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }
  }

  next(): void {
    if (this.viewMode() === 'week') {
      this.currentWeekStart.update((d) => {
        const n = new Date(d);
        n.setDate(n.getDate() + 7);
        return n;
      });
    } else {
      this.currentMonth.update((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    }
  }

  today(): void {
    if (this.viewMode() === 'week') {
      this.currentWeekStart.set(this._getWeekStart(new Date()));
    } else {
      this.currentMonth.set(new Date());
    }
  }

  selectDay(day: CalendarDay): void {
    this.daySelected.emit(day.date);
  }

  selectEvent(event: AgendaEvent): void {
    this.eventClick.emit(event);
  }

  private _buildWeek(startDate: Date, evts: AgendaEvent[], now: Date): CalendarDay[] {
    const month = startDate.getMonth();
    const week: CalendarDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + d);
      const dateStr = this._formatDate(date);
      week.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === month,
        isToday: this._isSameDay(date, now),
        events: evts.filter((e) => e.date === dateStr),
      });
    }
    return week;
  }

  private _getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
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
