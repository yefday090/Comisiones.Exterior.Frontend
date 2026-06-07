import { Injectable } from '@angular/core';
import { FormFieldConfig } from '../models/form-field.model';

@Injectable({ providedIn: 'root' })
export class FormConfigService {
  getSearchFields(): FormFieldConfig[] {
    const fields: FormFieldConfig[] = [
      {
        name: 'fechaCreacion',
        label: 'Fecha creación',
        type: 'date-range',
        order: 1,
      },
      {
        name: 'tipo',
        label: 'Tipo',
        type: 'select',
        options: [
          { value: 'Extemporanea', label: 'Extemporánea' },
          { value: 'Normal', label: 'Normal' },
          { value: 'Extra Oficial', label: 'Extra Oficial' },
        ],
        order: 2,
      },
      {
        name: 'asignadaA',
        label: 'Asignada a',
        type: 'text',
        placeholder: 'Nombre del funcionario',
        order: 3,
      },
      {
        name: 'estado',
        label: 'Estado',
        type: 'select',
        options: [
          { value: 'Pendiente', label: 'Pendiente' },
          { value: 'Confirmada', label: 'Confirmada' },
          { value: 'Cancelada', label: 'Cancelada' },
        ],
        order: 4,
      },
    ];

    return fields.sort((a, b) => a.order - b.order);
  }

  getAgendaSearchFields(): FormFieldConfig[] {
    const fields: FormFieldConfig[] = [
      {
        name: 'fechaCreacion',
        label: 'Fecha creación',
        type: 'date-range',
        order: 1,
      },
      {
        name: 'tipo',
        label: 'Tipo',
        type: 'select',
        options: [
          { value: 'Extemporanea', label: 'Extemporánea' },
          { value: 'Normal', label: 'Normal' },
          { value: 'Extra Oficial', label: 'Extra Oficial' },
        ],
        order: 2,
      },
      {
        name: 'asignadaA',
        label: 'Asignada a',
        type: 'text',
        placeholder: 'Nombre del funcionario',
        order: 3,
      },
      {
        name: 'estado',
        label: 'Estado',
        type: 'select',
        options: [
          { value: 'Pendiente', label: 'Pendiente' },
          { value: 'Confirmada', label: 'Confirmada' },
          { value: 'Cancelada', label: 'Cancelada' },
        ],
        order: 4,
      },
    ];

    return fields.sort((a, b) => a.order - b.order);
  }
}
