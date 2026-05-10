import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AgendaEvent } from '../../models/agenda-event.model';

export interface EventDialogData {
  event?: AgendaEvent | null;
}

@Component({
  selector: 'app-event-dialog',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './event-dialog.component.html',
  styleUrl: './event-dialog.component.scss',
})
export class EventDialogComponent {
  readonly dialogRef = inject(MatDialogRef<EventDialogComponent>);
  readonly data = inject<EventDialogData>(MAT_DIALOG_DATA);

  readonly isEdit = !!this.data.event;

  title = this.data.event?.title ?? '';
  description = this.data.event?.description ?? '';
  startTime = this.data.event?.startTime ?? '08:00';
  endTime = this.data.event?.endTime ?? '09:00';
  tipo = this.data.event?.tipo ?? 'Normal';
  estado = this.data.event?.estado ?? 'Pendiente';

  // Date as Date object for datepicker, synced with string.
  // Cache the Date to avoid infinite change detection: a getter
  // returning `new Date(...)` creates a new object reference every
  // time, which Angular interprets as a change and re-invokes the
  // setter — causing a freeze.
  private _dateStr = this.data.event?.date ?? this._todayStr();
  private _cachedDate = new Date(this._dateStr + 'T12:00:00');

  get pickerDate(): Date {
    return this._cachedDate;
  }

  set pickerDate(val: Date) {
    if (val) {
      this._dateStr = this._formatDate(val);
      this._cachedDate = new Date(this._dateStr + 'T12:00:00');
    }
  }

  readonly tipos: AgendaEvent['tipo'][] = ['Normal', 'Extemporanea', 'Extra Oficial'];
  readonly estados: AgendaEvent['estado'][] = ['Pendiente', 'Confirmada', 'Cancelada'];

  get dialogTitle(): string {
    return this.isEdit ? 'Editar Comisión' : 'Nueva Comisión';
  }

  save(): void {
    if (!this.title.trim() || !this._dateStr) return;

    const event: AgendaEvent = {
      id: this.data.event?.id ?? crypto.randomUUID(),
      title: this.title.trim(),
      description: this.description.trim(),
      date: this._dateStr,
      startTime: this.startTime,
      endTime: this.endTime,
      tipo: this.tipo,
      estado: this.estado,
      assignedTo: this.data.event?.assignedTo ?? 'admin',
      color: this._colorForTipo(this.tipo),
    };

    this.dialogRef.close(event);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  private _todayStr(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private _formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private _colorForTipo(tipo: AgendaEvent['tipo']): string {
    const map: Record<string, string> = {
      Normal: '#4caf50',
      Extemporanea: '#ff9800',
      'Extra Oficial': '#9c27b0',
    };
    return map[tipo] ?? '#1976d2';
  }
}
