import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <div class="page">
      <h2>Consultar Agenda</h2>
      <p>Acá se consulta la agenda de comisiones programadas.</p>
    </div>
  `,
  styles: `
    .page { padding: 2rem; }
    h2 { color: #1a1a2e; margin: 0 0 0.5rem; }
    p { color: #6b7280; }
  `,
})
export class ConsultarAgendaComponent {}
