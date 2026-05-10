import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';

interface FiltroComision {
  fechaDesde: Date | null;
  fechaHasta: Date | null;
  tipo: string;
  asignadaA: string;
  estado: string;
}

@Component({
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgFor,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
  ],
  template: `
    <div class="page">
      <h2>Asignar Comisión</h2>
      <p class="subtitle">Buscá comisiones para asignar.</p>

      <!-- Filtros -->
      <mat-card class="filtros-card">
        <mat-card-header>
          <mat-card-title>Filtros de búsqueda</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="buscar()" #filtroForm="ngForm">
            <div class="filters-grid">
              <!-- Fecha Desde -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Fecha desde</mat-label>
                <input
                  matInput
                  [matDatepicker]="pickerDesde"
                  name="fechaDesde"
                  [(ngModel)]="filtro.fechaDesde"
                />
                <mat-datepicker-toggle matIconSuffix [for]="pickerDesde" />
                <mat-datepicker #pickerDesde />
              </mat-form-field>

              <!-- Fecha Hasta -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Fecha hasta</mat-label>
                <input
                  matInput
                  [matDatepicker]="pickerHasta"
                  name="fechaHasta"
                  [(ngModel)]="filtro.fechaHasta"
                />
                <mat-datepicker-toggle matIconSuffix [for]="pickerHasta" />
                <mat-datepicker #pickerHasta />
              </mat-form-field>

              <!-- Tipo -->
              <mat-form-field appearance="outline">
                <mat-label>Tipo</mat-label>
                <mat-select name="tipo" [(ngModel)]="filtro.tipo">
                  <mat-option value="">Todos</mat-option>
                  <mat-option value="Extemporanea">Extemporánea</mat-option>
                  <mat-option value="Normal">Normal</mat-option>
                  <mat-option value="Extra Oficial">Extra Oficial</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Asignada a -->
              <mat-form-field appearance="outline">
                <mat-label>Asignada a</mat-label>
                <input
                  matInput
                  name="asignadaA"
                  [(ngModel)]="filtro.asignadaA"
                  placeholder="Nombre del funcionario"
                />
              </mat-form-field>

              <!-- Estado -->
              <mat-form-field appearance="outline">
                <mat-label>Estado</mat-label>
                <mat-select name="estado" [(ngModel)]="filtro.estado">
                  <mat-option value="">Todos</mat-option>
                  <mat-option value="Radicada">Radicada</mat-option>
                  <mat-option value="Asignada">Asignada</mat-option>
                  <mat-option value="Terminada">Terminada</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-flat-button type="submit">
                <mat-icon>search</mat-icon>
                Buscar
              </button>
              <button mat-stroked-button type="button" (click)="limpiar()">
                <mat-icon>cleaning_services</mat-icon>
                Limpiar
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Resultados -->
      <mat-card class="resultados-card" *ngIf="buscado">
        <mat-card-header>
          <mat-card-title>Resultados</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <p class="text-muted" *ngIf="resultados.length === 0">
            No se encontraron comisiones con los filtros aplicados.
          </p>

          <table mat-table [dataSource]="resultados" *ngIf="resultados.length > 0">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let r">{{ r.id }}</td>
            </ng-container>

            <ng-container matColumnDef="tipo">
              <th mat-header-cell *matHeaderCellDef>Tipo</th>
              <td mat-cell *matCellDef="let r">{{ r.tipo }}</td>
            </ng-container>

            <ng-container matColumnDef="asignadaA">
              <th mat-header-cell *matHeaderCellDef>Asignada a</th>
              <td mat-cell *matCellDef="let r">{{ r.asignadaA }}</td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let r">
                <mat-chip [class]="r.estado.toLowerCase()" highlighted>{{ r.estado }}</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="fechaCreacion">
              <th mat-header-cell *matHeaderCellDef>Fecha creación</th>
              <td mat-cell *matCellDef="let r">{{ r.fechaCreacion }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .page {
        padding: 2rem;
        max-width: 1200px;
      }

      h2 {
        margin: 0 0 0.25rem;
        font-size: 1.5rem;
        font-weight: 500;
      }

      .subtitle {
        margin: 0 0 2rem;
        color: rgba(0, 0, 0, 0.6);
        font-size: 0.95rem;
      }

      /* ── Cards ─────────────────────────────── */
      .filtros-card {
        margin-bottom: 1.5rem;
      }

      .resultados-card {
        margin-bottom: 1.5rem;
      }

      /* ── Filters Grid ──────────────────────── */
      .filters-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 1rem;
        margin-bottom: 0.5rem;
      }

      .full-width {
        width: 100%;
      }

      /* ── Buttons ───────────────────────────── */
      .form-actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 0.5rem;
      }

      /* ── Table ─────────────────────────────── */
      table {
        width: 100%;
      }

      /* ── Chips (Badges) ────────────────────── */
      .radicada {
        --mdc-chip-elevated-container-color: #dbeafe;
        --mdc-chip-label-text-color: #1e40af;
      }

      .asignada {
        --mdc-chip-elevated-container-color: #fef3c7;
        --mdc-chip-label-text-color: #92400e;
      }

      .terminada {
        --mdc-chip-elevated-container-color: #d1fae5;
        --mdc-chip-label-text-color: #065f46;
      }

      .text-muted {
        color: rgba(0, 0, 0, 0.5);
        font-size: 0.95rem;
        padding: 1rem 0;
      }

      /* ── Responsive ────────────────────────── */
      @media (max-width: 1100px) {
        .filters-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media (max-width: 700px) {
        .filters-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 480px) {
        .filters-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AsignarComisionComponent {
  filtro: FiltroComision = {
    fechaDesde: null,
    fechaHasta: null,
    tipo: '',
    asignadaA: '',
    estado: '',
  };

  buscado = false;
  resultados: any[] = [];
  displayedColumns = ['id', 'tipo', 'asignadaA', 'estado', 'fechaCreacion'];

  // Datos de ejemplo (reemplazar por API)
  private readonly datosMock = [
    { id: 'COM-001', tipo: 'Normal', asignadaA: 'Carlos Pérez', estado: 'Radicada', fechaCreacion: '2026-05-01' },
    { id: 'COM-002', tipo: 'Extemporanea', asignadaA: 'María López', estado: 'Asignada', fechaCreacion: '2026-04-28' },
    { id: 'COM-003', tipo: 'Extra Oficial', asignadaA: 'Juan Ríos', estado: 'Terminada', fechaCreacion: '2026-04-15' },
    { id: 'COM-004', tipo: 'Normal', asignadaA: 'Ana Torres', estado: 'Asignada', fechaCreacion: '2026-05-05' },
    { id: 'COM-005', tipo: 'Normal', asignadaA: 'Carlos Pérez', estado: 'Radicada', fechaCreacion: '2026-05-08' },
  ];

  buscar(): void {
    this.buscado = true;

    this.resultados = this.datosMock.filter((d) => {
      const fechaOk =
        (!this.filtro.fechaDesde || d.fechaCreacion >= this.formatDate(this.filtro.fechaDesde)) &&
        (!this.filtro.fechaHasta || d.fechaCreacion <= this.formatDate(this.filtro.fechaHasta));
      const tipoOk = !this.filtro.tipo || d.tipo === this.filtro.tipo;
      const asignadoOk =
        !this.filtro.asignadaA ||
        d.asignadaA.toLowerCase().includes(this.filtro.asignadaA.toLowerCase());
      const estadoOk = !this.filtro.estado || d.estado === this.filtro.estado;

      return fechaOk && tipoOk && asignadoOk && estadoOk;
    });
  }

  limpiar(): void {
    this.filtro = { fechaDesde: null, fechaHasta: null, tipo: '', asignadaA: '', estado: '' };
    this.buscado = false;
    this.resultados = [];
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
