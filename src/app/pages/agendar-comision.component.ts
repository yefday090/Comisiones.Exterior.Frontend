import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <div class="page">
      <h2>Agendar Comisión</h2>
      <p>Acá se agendan las comisiones con fecha y hora.</p>
    </div>
  `,
  styles: `
    .page { padding: 2rem; }
    h2 { color: #1a1a2e; margin: 0 0 0.5rem; }
    p { color: #6b7280; }
  `,
})
export class AgendarComisionComponent {}
