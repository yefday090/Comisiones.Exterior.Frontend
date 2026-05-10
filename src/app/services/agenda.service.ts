import { Injectable, computed, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AgendaEvent } from '../models/agenda-event.model';

@Injectable({ providedIn: 'root' })
export class AgendaService {
  private readonly _events = signal<AgendaEvent[]>(this.buildMockData());
  readonly events = this._events.asReadonly();

  readonly userEvents = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this._events().filter((e) => e.assignedTo === user);
  });

  constructor(private readonly auth: AuthService) {}

  getEvents(): AgendaEvent[] {
    return this.userEvents();
  }

  addEvent(event: AgendaEvent): void {
    this._events.update((events) => [...events, event]);
  }

  updateEvent(event: AgendaEvent): void {
    this._events.update((events) =>
      events.map((e) => (e.id === event.id ? event : e))
    );
  }

  deleteEvent(id: string): void {
    this._events.update((events) => events.filter((e) => e.id !== id));
  }

  private buildMockData(): AgendaEvent[] {
    const user = this.auth.currentUser() ?? 'admin';
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const pad = (n: number) => String(n).padStart(2, '0');
    const day = (d: number) => `${year}-${pad(month + 1)}-${pad(d)}`;

    const tipos: AgendaEvent['tipo'][] = ['Normal', 'Extemporanea', 'Extra Oficial'];
    const estados: AgendaEvent['estado'][] = ['Pendiente', 'Confirmada', 'Cancelada'];
    const colors: Record<AgendaEvent['tipo'], string> = {
      Normal: '#4caf50',
      Extemporanea: '#ff9800',
      'Extra Oficial': '#9c27b0',
    };

    const titles = [
      'Reunión con delegación comercial',
      'Inspección de frontera norte',
      'Coordinación logística sector sur',
      'Visita a puesto de control',
      'Evaluación de infraestructura',
      'Capacitación equipo territorial',
      'Auditoría de procesos aduaneros',
      'Reunión bilateral con contraparte',
      'Supervisión operativa zona este',
      'Cierre de informe mensual',
    ];

    const usedDays = new Set<number>();
    const events: AgendaEvent[] = [];
    const count = 10;

    for (let i = 0; i < count; i++) {
      let d: number;
      do {
        d = Math.floor(Math.random() * daysInMonth) + 1;
      } while (usedDays.has(d));
      usedDays.add(d);

      const tipo = pick(tipos);
      const startHour = 8 + Math.floor(Math.random() * 8);
      const duration = 1 + Math.floor(Math.random() * 3);
      const startTime = `${pad(startHour)}:00`;
      const endTime = `${pad(Math.min(startHour + duration, 18))}:00`;

      events.push({
        id: crypto.randomUUID(),
        title: titles[i],
        description: `Comisión ${tipo.toLowerCase()} programada para el día ${d}.`,
        date: day(d),
        startTime,
        endTime,
        tipo,
        estado: pick(estados),
        assignedTo: user,
        color: colors[tipo],
      });
    }

    return events;
  }
}
