import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AgendaEvent } from '../models/agenda-event.model';
import { AgendaCrudService, AgendaEventApi, CreateAgendaEventRequest, UpdateAgendaEventRequest, AgendaSearchFilters } from './agenda-crud.service';
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

  loadEvents(filters?: AgendaSearchFilters): void {
    this.crud.getAll(filters).subscribe({
      next: (data) => {
        this._events.set(data.map((e) => this.mapToEvent(e)));
      },
      error: () => {
        this.notify.error('Error al cargar los eventos');
      },
    });
  }

  addEvent(event: AgendaEvent): void {
    const req = this.mapToRequest(event);
    this.crud.create(req).subscribe({
      next: () => {
        this.notify.success('Evento creado');
        this.loadEvents();
      },
      error: () => this.notify.error('Error al crear el evento'),
    });
  }

  updateEvent(event: AgendaEvent): void {
    const req = this.mapToUpdateRequest(event);
    this.crud.update(event.id, req).subscribe({
      next: () => {
        this.notify.success('Evento actualizado');
        this.loadEvents();
      },
      error: () => this.notify.error('Error al actualizar el evento'),
    });
  }

  deleteEvent(id: string): void {
    this.crud.delete(id).subscribe({
      next: () => {
        this.notify.success('Evento eliminado');
        this.loadEvents();
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
      tipo: this.mapType(api.type.description),
      estado: api.status.description as AgendaEvent['estado'],
      assignedTo: api.assignedTo ?? '',
      color: this.colorForType(api.type.description),
    };
  }

  private mapType(desc: string): AgendaEvent['tipo'] {
    if (desc === 'ExtraOficial') return 'Extra Oficial';
    return desc as AgendaEvent['tipo'];
  }

  private mapToRequest(event: AgendaEvent): CreateAgendaEventRequest {
    return {
      title: event.title,
      description: event.description || undefined,
      date: event.date,
      startTime: event.startTime || undefined,
      endTime: event.endTime || undefined,
      type: { value: this.typeToValue(event.tipo), description: event.tipo },
      status: { value: this.statusToValue(event.estado), description: event.estado },
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

  private typeToValue(tipo: string): string {
    const map: Record<string, string> = { Normal: '0', Extemporanea: '1', 'Extra Oficial': '2' };
    return map[tipo] ?? '0';
  }

  private statusToValue(estado: string): string {
    const map: Record<string, string> = { Pendiente: '0', Confirmada: '1', Cancelada: '2' };
    return map[estado] ?? '0';
  }
}
