import {
  Component,
  input,
  output,
  OnInit,
} from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
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
    ReactiveFormsModule,
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
        <form [formGroup]="form">
          <div class="filters-grid">
            @for (field of fields(); track field.name) {
              @if (field.type === 'date-range') {
                <!-- Date range: Desde -->
                <mat-form-field appearance="outline">
                  <mat-label>{{ field.label }} desde</mat-label>
                  <input
                    matInput
                    [matDatepicker]="desdePicker"
                    [formControl]="getControl(field.name + '_desde')"
                  />
                  <mat-datepicker-toggle matIconSuffix [for]="desdePicker" />
                  <mat-datepicker #desdePicker />
                </mat-form-field>

                <!-- Date range: Hasta -->
                <mat-form-field appearance="outline">
                  <mat-label>{{ field.label }} hasta</mat-label>
                  <input
                    matInput
                    [matDatepicker]="hastaPicker"
                    [formControl]="getControl(field.name + '_hasta')"
                  />
                  <mat-datepicker-toggle matIconSuffix [for]="hastaPicker" />
                  <mat-datepicker #hastaPicker />
                </mat-form-field>
              } @else if (field.type === 'select') {
                <mat-form-field appearance="outline">
                  <mat-label>{{ field.label }}</mat-label>
                  <mat-select [formControlName]="field.name">
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
                    [formControlName]="field.name"
                    [placeholder]="field.placeholder || ''"
                  />
                </mat-form-field>
              }
            }
          </div>

          <div class="form-actions">
            <button mat-flat-button (click)="onSearch()">
              <mat-icon>search</mat-icon>
              Buscar
            </button>
            <button mat-stroked-button (click)="onClear()">
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

  form = new FormGroup({});

  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  ngOnInit(): void {
    for (const field of this.fields()) {
      if (field.type === 'date-range') {
        this.form.addControl(field.name + '_desde', new FormControl(null));
        this.form.addControl(field.name + '_hasta', new FormControl(null));
      } else {
        this.form.addControl(field.name, new FormControl(''));
      }
    }
  }

  onSearch(): void {
    this.search.emit(this.form.value);
  }

  onClear(): void {
    for (const field of this.fields()) {
      if (field.type === 'date-range') {
        this.form.get(field.name + '_desde')!.reset(null);
        this.form.get(field.name + '_hasta')!.reset(null);
      } else {
        this.form.get(field.name)!.reset('');
      }
    }
    this.clear.emit();
  }
}
