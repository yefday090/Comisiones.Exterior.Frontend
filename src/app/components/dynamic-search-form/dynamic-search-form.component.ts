import {
  Component,
  input,
  output,
  OnInit,
} from '@angular/core';
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
import { FormFieldConfig } from '../../models/form-field.model';

@Component({
  selector: 'app-dynamic-search-form',
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
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Filtros de búsqueda</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <form (ngSubmit)="onSearch()" #form="ngForm">
          <div class="filters-grid">
            @for (field of fields(); track field.name) {
              @if (field.type === 'date-range') {
                <!-- Date range: Desde -->
                <mat-form-field appearance="outline">
                  <mat-label>{{ field.label }} desde</mat-label>
                  <input
                    matInput
                    type="date"
                    [name]="field.name + '_desde'"
                    [(ngModel)]="values[field.name + '_desde']"
                  />
                </mat-form-field>

                <!-- Date range: Hasta -->
                <mat-form-field appearance="outline">
                  <mat-label>{{ field.label }} hasta</mat-label>
                  <input
                    matInput
                    type="date"
                    [name]="field.name + '_hasta'"
                    [(ngModel)]="values[field.name + '_hasta']"
                  />
                </mat-form-field>
              } @else if (field.type === 'select') {
                <mat-form-field appearance="outline">
                  <mat-label>{{ field.label }}</mat-label>
                  <mat-select
                    [name]="field.name"
                    [(ngModel)]="values[field.name]"
                  >
                    <mat-option value="">Todos</mat-option>
                    @for (opt of field.options; track opt.value) {
                      <mat-option [value]="opt.value">{{ opt.label }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
              } @else {
                <mat-form-field appearance="outline">
                  <mat-label>{{ field.label }}</mat-label>
                  <input
                    matInput
                    [name]="field.name"
                    [(ngModel)]="values[field.name]"
                    [placeholder]="field.placeholder || ''"
                  />
                </mat-form-field>
              }
            }
          </div>

          <div class="form-actions">
            <button mat-flat-button type="submit">
              <mat-icon>search</mat-icon>
              Buscar
            </button>
            <button mat-stroked-button type="button" (click)="onClear()">
              <mat-icon>cleaning_services</mat-icon>
              Limpiar
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .filters-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 1rem;
        margin-bottom: 0.5rem;
      }

      .form-actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 0.5rem;
      }

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
export class DynamicSearchFormComponent implements OnInit {
  fields = input.required<FormFieldConfig[]>();
  search = output<Record<string, any>>();
  clear = output<void>();

  values: Record<string, any> = {};

  ngOnInit(): void {
    this.initValues();
  }

  onSearch(): void {
    this.search.emit({ ...this.values });
  }

  onClear(): void {
    this.initValues();
    this.clear.emit();
  }

  private initValues(): void {
    const newValues: Record<string, any> = {};
    for (const field of this.fields()) {
      if (field.type === 'date-range') {
        newValues[field.name + '_desde'] = null;
        newValues[field.name + '_hasta'] = null;
      } else {
        newValues[field.name] = '';
      }
    }
    this.values = newValues;
  }
}
