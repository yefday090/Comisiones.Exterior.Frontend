import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../auth/auth.service';
import { AgendaCrudService, AgendaEventApi } from '../services/agenda-crud.service';

@Component({
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatDividerModule, MatProgressSpinnerModule],
  template: `
    <div class="page">
      <h2>Consultar Agenda</h2>
      <p class="subtitle">Comisiones asignadas a {{ user() }}</p>

      @if (loading()) {
        <mat-spinner diameter="32" class="spinner" />
      } @else if (eventos().length === 0) {
        <mat-card class="empty-card">
          <mat-card-content>
            <p>No tenés comisiones asignadas.</p>
          </mat-card-content>
        </mat-card>
      } @else {
        <div class="events-list">
          @for (evt of eventos(); track evt.id) {
            <mat-card class="event-card">
              <mat-card-header>
                <mat-card-title>{{ evt.title }}</mat-card-title>
                <mat-card-subtitle>{{ evt.date }}</mat-card-subtitle>
              </mat-card-header>
              <mat-divider />
              <mat-card-content>
                @if (evt.description) {
                  <p class="description">{{ evt.description }}</p>
                }
                <div class="meta">
                  <span><strong>Horario:</strong> {{ evt.startTime || '—' }} - {{ evt.endTime || '—' }}</span>
                  <span><strong>Asignado a:</strong> {{ evt.assignedTo || '—' }}</span>
                </div>
                <div class="chips">
                  <mat-chip [class]="evt.type.description.toLowerCase().replace(' ', '-')" highlighted>
                    {{ evt.type.description }}
                  </mat-chip>
                  <mat-chip [class]="evt.status.description.toLowerCase()" highlighted>
                    {{ evt.status.description }}
                  </mat-chip>
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .page {
        padding: 2rem;
        max-width: 900px;
      }

      h2 {
        margin: 0 0 0.25rem;
        font-size: 1.5rem;
        font-weight: 500;
      }

      .subtitle {
        margin: 0 0 2rem;
        color: rgba(0, 0, 0, 0.6);
      }

      .spinner {
        margin: 2rem auto;
      }

      .empty-card {
        text-align: center;
        color: #6b7280;
      }

      .events-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .event-card {
        .description {
          color: #4b5563;
          margin: 0 0 0.75rem;
        }

        .meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.85rem;
          color: #6b7280;
          margin-bottom: 0.75rem;
        }

        .chips {
          display: flex;
          gap: 0.5rem;
        }
      }

      .normal {
        --mdc-chip-elevated-container-color: #d1fae5;
        --mdc-chip-label-text-color: #065f46;
      }

      .extemporanea {
        --mdc-chip-elevated-container-color: #fef3c7;
        --mdc-chip-label-text-color: #92400e;
      }

      .extra-oficial {
        --mdc-chip-elevated-container-color: #ede9fe;
        --mdc-chip-label-text-color: #5b21b6;
      }

      .pendiente {
        --mdc-chip-elevated-container-color: #dbeafe;
        --mdc-chip-label-text-color: #1e40af;
      }

      .confirmada {
        --mdc-chip-elevated-container-color: #d1fae5;
        --mdc-chip-label-text-color: #065f46;
      }

      .cancelada {
        --mdc-chip-elevated-container-color: #fee2e2;
        --mdc-chip-label-text-color: #991b1b;
      }
    `,
  ],
})
export class ConsultarAgendaComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly crud = inject(AgendaCrudService);

  readonly user = this.auth.currentUser;
  readonly eventos = signal<AgendaEventApi[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    const userEmail = this.user();
    if (userEmail) {
      this.crud.getAll({ assignedTo: userEmail }).subscribe({
        next: (data) => {
          this.eventos.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
    } else {
      this.loading.set(false);
    }
  }
}
