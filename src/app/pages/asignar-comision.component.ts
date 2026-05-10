import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

interface FiltroComision {
  fechaDesde: string;
  fechaHasta: string;
  tipo: string;
  asignadaA: string;
  estado: string;
}

@Component({
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  template: `
    <div class="page">
      <h2>Asignar Comisión</h2>
      <p class="subtitle">Buscá comisiones para asignar.</p>

      <!-- Filtros -->
      <div class="card filtros">
        <h3>Filtros de búsqueda</h3>

        <form (ngSubmit)="buscar()" #filtroForm="ngForm">
          <div class="filters-grid">
            <!-- Fecha Desde -->
            <div class="field">
              <label for="fechaDesde">Fecha desde</label>
              <input
                id="fechaDesde"
                name="fechaDesde"
                type="date"
                [(ngModel)]="filtro.fechaDesde"
              />
            </div>

            <!-- Fecha Hasta -->
            <div class="field">
              <label for="fechaHasta">Fecha hasta</label>
              <input
                id="fechaHasta"
                name="fechaHasta"
                type="date"
                [(ngModel)]="filtro.fechaHasta"
              />
            </div>

            <!-- Tipo -->
            <div class="field">
              <label for="tipo">Tipo</label>
              <select id="tipo" name="tipo" [(ngModel)]="filtro.tipo">
                <option value="">— Todos —</option>
                <option value="Extemporanea">Extemporánea</option>
                <option value="Normal">Normal</option>
                <option value="Extra Oficial">Extra Oficial</option>
              </select>
            </div>

            <!-- Asignada a -->
            <div class="field">
              <label for="asignadaA">Asignada a</label>
              <input
                id="asignadaA"
                name="asignadaA"
                type="text"
                [(ngModel)]="filtro.asignadaA"
                placeholder="Nombre del funcionario"
              />
            </div>

            <!-- Estado -->
            <div class="field">
              <label for="estado">Estado</label>
              <select id="estado" name="estado" [(ngModel)]="filtro.estado">
                <option value="">— Todos —</option>
                <option value="Radicada">Radicada</option>
                <option value="Asignada">Asignada</option>
                <option value="Terminada">Terminada</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary">🔍 Buscar</button>
            <button type="button" class="btn-secondary" (click)="limpiar()">Limpiar</button>
          </div>
        </form>
      </div>

      <!-- Resultados -->
      <div class="card resultados" *ngIf="buscado">
        <h3>Resultados</h3>
        <p class="text-muted" *ngIf="resultados.length === 0">
          No se encontraron comisiones con los filtros aplicados.
        </p>

        <table *ngIf="resultados.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Asignada a</th>
              <th>Estado</th>
              <th>Fecha creación</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of resultados">
              <td>{{ r.id }}</td>
              <td>{{ r.tipo }}</td>
              <td>{{ r.asignadaA }}</td>
              <td><span class="badge" [class]="r.estado.toLowerCase()">{{ r.estado }}</span></td>
              <td>{{ r.fechaCreacion }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      .page {
        padding: 2rem;
        max-width: 1100px;
      }

      h2 {
        color: #1a1a2e;
        margin: 0 0 0.25rem;
        font-size: 1.5rem;
      }

      .subtitle {
        color: #6b7280;
        margin: 0 0 2rem;
        font-size: 0.9rem;
      }

      /* ── Cards ─────────────────────────────── */
      .card {
        background: #ffffff;
        border-radius: 10px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        margin-bottom: 1.5rem;
      }

      .card h3 {
        margin: 0 0 1.25rem;
        font-size: 1rem;
        color: #1a1a2e;
      }

      /* ── Filters Grid ──────────────────────── */
      .filters-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 1.25rem;
        margin-bottom: 1.25rem;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }

      .field label {
        font-size: 0.8rem;
        font-weight: 600;
        color: #374151;
        white-space: nowrap;
      }

      .field input,
      .field select {
        padding: 0.6rem 0.75rem;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 0.9rem;
        outline: none;
        transition: border-color 0.15s ease;
        background: #ffffff;
        width: 100%;
        box-sizing: border-box;
      }

      .field input:focus,
      .field select:focus {
        border-color: #0f3460;
      }

      /* ── Buttons ───────────────────────────── */
      .form-actions {
        display: flex;
        gap: 0.75rem;
      }

      .btn-primary {
        padding: 0.65rem 1.5rem;
        background: #0f3460;
        color: #ffffff;
        border: none;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s ease;
      }

      .btn-primary:hover {
        background: #16213e;
      }

      .btn-secondary {
        padding: 0.65rem 1.5rem;
        background: #f3f4f6;
        color: #374151;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .btn-secondary:hover {
        background: #e5e7eb;
      }

      /* ── Table ─────────────────────────────── */
      table {
        width: 100%;
        border-collapse: collapse;
      }

      th {
        text-align: left;
        font-size: 0.78rem;
        font-weight: 700;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0.75rem 0.5rem;
        border-bottom: 2px solid #e5e7eb;
      }

      td {
        padding: 0.7rem 0.5rem;
        font-size: 0.88rem;
        color: #374151;
        border-bottom: 1px solid #f3f4f6;
      }

      tr:hover td {
        background: #f9fafb;
      }

      /* ── Badges ────────────────────────────── */
      .badge {
        display: inline-block;
        padding: 0.2rem 0.6rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.02em;
      }

      .badge.radicada {
        background: #dbeafe;
        color: #1e40af;
      }

      .badge.asignada {
        background: #fef3c7;
        color: #92400e;
      }

      .badge.terminada {
        background: #d1fae5;
        color: #065f46;
      }

      .text-muted {
        color: #9ca3af;
        font-size: 0.9rem;
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
    fechaDesde: '',
    fechaHasta: '',
    tipo: '',
    asignadaA: '',
    estado: '',
  };

  buscado = false;
  resultados: any[] = [];

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
        (!this.filtro.fechaDesde || d.fechaCreacion >= this.filtro.fechaDesde) &&
        (!this.filtro.fechaHasta || d.fechaCreacion <= this.filtro.fechaHasta);
      const tipoOk = !this.filtro.tipo || d.tipo === this.filtro.tipo;
      const asignadoOk =
        !this.filtro.asignadaA ||
        d.asignadaA.toLowerCase().includes(this.filtro.asignadaA.toLowerCase());
      const estadoOk = !this.filtro.estado || d.estado === this.filtro.estado;

      return fechaOk && tipoOk && asignadoOk && estadoOk;
    });
  }

  limpiar(): void {
    this.filtro = { fechaDesde: '', fechaHasta: '', tipo: '', asignadaA: '', estado: '' };
    this.buscado = false;
    this.resultados = [];
  }
}
