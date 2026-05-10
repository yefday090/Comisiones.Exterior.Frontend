import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <div class="page">
      <h2>Asignar Comisión</h2>
      <p>Acá se asignan las comisiones a los funcionarios.</p>
    </div>
  `,
  styles: `
    .page { padding: 2rem; }
    h2 { color: #1a1a2e; margin: 0 0 0.5rem; }
    p { color: #6b7280; }
  `,
})
export class AsignarComisionComponent {}
