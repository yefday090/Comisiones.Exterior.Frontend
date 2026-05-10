import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { FormFieldConfig } from '../models/form-field.model';
import { FormConfigService } from '../services/form-config.service';
import { DynamicSearchFormComponent } from '../components/dynamic-search-form/dynamic-search-form.component';

interface ComisionRow {
  id: string;
  tipo: string;
  asignadaA: string;
  estado: string;
  fechaCreacion: string;
}

@Component({
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatCardModule,
    MatChipsModule,
    MatTableModule,
    DynamicSearchFormComponent,
  ],
  template: `
    <div class="page">
      <h2>Asignar Comisión</h2>
      <p class="subtitle">Buscá comisiones para asignar.</p>

      <!-- Dynamic Search Form -->
      <app-dynamic-search-form
        [fields]="fields"
        (search)="onSearch($event)"
        (clear)="onClear()"
      />

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

      .resultados-card {
        margin-bottom: 1.5rem;
      }

      table {
        width: 100%;
      }

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
    `,
  ],
})
export class AsignarComisionComponent implements OnInit {
  fields: FormFieldConfig[] = [];

  buscado = false;
  resultados: ComisionRow[] = [];
  displayedColumns = ['id', 'tipo', 'asignadaA', 'estado', 'fechaCreacion'];

  private readonly datosMock: ComisionRow[] = [
    { id: 'COM-001', tipo: 'Normal', asignadaA: 'Carlos Pérez', estado: 'Radicada', fechaCreacion: '2026-05-01' },
    { id: 'COM-002', tipo: 'Extemporanea', asignadaA: 'María López', estado: 'Asignada', fechaCreacion: '2026-04-28' },
    { id: 'COM-003', tipo: 'Extra Oficial', asignadaA: 'Juan Ríos', estado: 'Terminada', fechaCreacion: '2026-04-15' },
    { id: 'COM-004', tipo: 'Normal', asignadaA: 'Ana Torres', estado: 'Asignada', fechaCreacion: '2026-05-05' },
    { id: 'COM-005', tipo: 'Normal', asignadaA: 'Carlos Pérez', estado: 'Radicada', fechaCreacion: '2026-05-08' },
  ];

  constructor(private formConfig: FormConfigService) {}

  ngOnInit(): void {
    this.fields = this.formConfig.getSearchFields();
  }

  onSearch(values: Record<string, any>): void {
    this.buscado = true;

    const fechaDesde = values['fechaCreacion_desde'] as Date | null;
    const fechaHasta = values['fechaCreacion_hasta'] as Date | null;
    const tipo = values['tipo'] as string;
    const asignadaA = values['asignadaA'] as string;
    const estado = values['estado'] as string;

    this.resultados = this.datosMock.filter((d) => {
      const fechaOk =
        (!fechaDesde || d.fechaCreacion >= this.formatDate(fechaDesde)) &&
        (!fechaHasta || d.fechaCreacion <= this.formatDate(fechaHasta));
      const tipoOk = !tipo || d.tipo === tipo;
      const asignadoOk = !asignadaA || d.asignadaA.toLowerCase().includes(asignadaA.toLowerCase());
      const estadoOk = !estado || d.estado === estado;

      return fechaOk && tipoOk && asignadoOk && estadoOk;
    });
  }

  onClear(): void {
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
