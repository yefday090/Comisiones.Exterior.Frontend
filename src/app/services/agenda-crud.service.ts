import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AgendaEventApi {
  id: string;
  title: string;
  description: string | null;
  date: string;       // "2026-06-06"
  startTime: string | null; // "08:00"
  endTime: string | null;   // "09:00"
  type: string;        // "Normal" | "Extemporanea" | "ExtraOficial"
  status: string;      // "Pendiente" | "Confirmada" | "Cancelada"
  assignedTo: string | null;
}

export interface CreateAgendaEventRequest {
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: string;
  status: string;
  assignedTo?: string;
}

export interface UpdateAgendaEventRequest {
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: string;
  status: string;
  assignedTo?: string;
}

@Injectable({ providedIn: 'root' })
export class AgendaCrudService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.agendaApiUrl}/api/agenda`;

  getAll(): Observable<AgendaEventApi[]> {
    return this.http.get<AgendaEventApi[]>(this.baseUrl);
  }

  getById(id: string): Observable<AgendaEventApi> {
    return this.http.get<AgendaEventApi>(`${this.baseUrl}/${id}`);
  }

  create(event: CreateAgendaEventRequest): Observable<AgendaEventApi> {
    return this.http.post<AgendaEventApi>(this.baseUrl, event);
  }

  update(id: string, event: UpdateAgendaEventRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, event);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
