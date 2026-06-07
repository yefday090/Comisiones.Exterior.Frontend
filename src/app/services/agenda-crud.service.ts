import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EnumValue {
  value: string;
  description: string;
}

export interface AgendaEventApi {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string | null;
  endTime: string | null;
  type: EnumValue;
  status: EnumValue;
  assignedTo: string | null;
}

export interface CreateAgendaEventRequest {
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: EnumValue;
  status: EnumValue;
  assignedTo?: string;
}

export interface UpdateAgendaEventRequest {
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: EnumValue;
  status: EnumValue;
  assignedTo?: string;
}

export interface AgendaSearchFilters {
  dateFrom?: string;
  dateTo?: string;
  type?: number;
  assignedTo?: string;
  status?: number;
}

@Injectable({ providedIn: 'root' })
export class AgendaCrudService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.agendaApiUrl}/api/agenda`;

  getAll(filters?: AgendaSearchFilters): Observable<AgendaEventApi[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params = params.set('dateTo', filters.dateTo);
      if (filters.type !== undefined && filters.type !== null) params = params.set('type', filters.type);
      if (filters.assignedTo) params = params.set('assignedTo', filters.assignedTo);
      if (filters.status !== undefined && filters.status !== null) params = params.set('status', filters.status);
    }
    return this.http.get<AgendaEventApi[]>(this.baseUrl, { params });
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
