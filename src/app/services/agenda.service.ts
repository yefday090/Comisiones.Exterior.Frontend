import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AgendaEvent } from '../models/agenda-event.model';
import { AgendaCrudService, AgendaEventApi, CreateAgendaEventRequest, UpdateAgendaEventRequest } from './agenda-crud.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class AgendaService {
  private readonly crud = inject(AgendaCrudService);
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotificationService);

  private readonly _events = signal<AgendaEvent[]>([]);
  readonly events = this._events.asReadonly();

  readonly userEvents = computed(() => {
    return this._events();
  });

  private _loaded = false;

  loadEvents(): void {
    if (this._loaded) return;
    this.crud.getAll().subscribe({
      next: (data) => {
        this._events.set(data.map((e) => this.mapToEvent(e)));
        this._loaded = true;
      },
      error: () => {
        this.notify.error('Error al cargar los eventos');
      },
    });
  }

  addEvent(event: AgendaEvent): void {
    const req = this.mapToRequest(event);
    this.crud.create(req).subscribe({
      next: (created) => {
        this._events.update((events) => [...events, this.mapToEvent(created)]);
        this.notify.success('Evento creado');
      },
      error: () => this.notify.error('Error al crear el evento'),
    });
  }

  updateEvent(event: AgendaEvent): void {
    const req = this.mapToUpdateRequest(event);
    this.crud.update(event.id, req).subscribe({
      next: () => {
        this._events.update((events) =>
          events.map((e) => (e.id === event.id ? event : e))
        );
        this.notify.success('Evento actualizado');
      },
      error: () => this.notify.error('Error al actualizar el evento'),
    });
  }

  deleteEvent(id: string): void {
    this.crud.delete(id).subscribe({
      next: () => {
        this._events.update((events) => events.filter((e) => e.id !== id));
        this.notify.success('Evento eliminado');
      },
      error: () => this.notify.error('Error al eliminar el evento'),
    });
  }

  // ── Mappers ─────────────────────────────────

  private mapToEvent(api: AgendaEventApi): AgendaEvent {
    return {
      id: api.id,
      title: api.title,
      description: api.description ?? '',
      date: api.date,
      startTime: api.startTime ?? '',
      endTime: api.endTime ?? '',
      tipo: (api.type === 'ExtraOficial' ? 'Extra Oficial' : api.type) as AgendaEvent['tipo'],
      estado: api.status as AgendaEvent['estado'],
      assignedTo: api.assignedTo ?? '',
      color: this.colorForType(api.type),
    };
  }

  private mapToRequest(event: AgendaEvent): CreateAgendaEventRequest {
    return {
      title: event.title,
      description: event.description || undefined,
      date: event.date,
      startTime: event.startTime || undefined,
      endTime: event.endTime || undefined,
      type: event.tipo,
      status: event.estado,
      assignedTo: event.assignedTo || undefined,
    };
  }

  private mapToUpdateRequest(event: AgendaEvent): UpdateAgendaEventRequest {
    return this.mapToRequest(event);
  }

  private colorForType(type: string): string {
    const map: Record<string, string> = {
      Normal: '#4caf50',
      Extemporanea: '#ff9800',
      ExtraOficial: '#9c27b0',
      'Extra Oficial': '#9c27b0',
    };
    return map[type] ?? '#1976d2';
  }
}
