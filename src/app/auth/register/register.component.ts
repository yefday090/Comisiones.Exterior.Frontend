import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <h1>Crear cuenta</h1>
        <p class="subtitle">Registrate para acceder al sistema</p>

        <form (ngSubmit)="onSubmit()" #form="ngForm">
          <div class="field">
            <label for="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              [(ngModel)]="email"
              placeholder="tu@email.com"
              autocomplete="email"
              required
            />
          </div>

          <div class="field">
            <label for="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              [(ngModel)]="password"
              placeholder="Mínimo 6 caracteres"
              autocomplete="new-password"
              required
              minlength="6"
            />
          </div>

          <div class="field">
            <label for="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              [(ngModel)]="confirmPassword"
              placeholder="Repetí la contraseña"
              autocomplete="new-password"
              required
            />
          </div>

          <button type="submit" [disabled]="loading || form.invalid">
            {{ buttonText }}
          </button>
        </form>

        <p class="footer-link">
          ¿Ya tenés cuenta? <a routerLink="/login">Iniciá sesión</a>
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .login-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100dvh;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      }

      .login-card {
        background: #ffffff;
        padding: 2.5rem 2rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        width: 100%;
        max-width: 400px;
      }

      h1 {
        font-size: 1.5rem;
        text-align: center;
        margin: 0 0 0.25rem;
        color: #1a1a2e;
      }

      .subtitle {
        text-align: center;
        color: #6b7280;
        margin: 0 0 2rem;
        font-size: 0.9rem;
      }

      .field {
        margin-bottom: 1.25rem;
      }

      .field label {
        display: block;
        font-size: 0.85rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.35rem;
      }

      .field input {
        width: 100%;
        padding: 0.7rem 0.85rem;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 0.95rem;
        transition: border-color 0.2s ease;
        box-sizing: border-box;
        outline: none;
      }

      .field input:focus {
        border-color: #0f3460;
      }

      button {
        width: 100%;
        padding: 0.75rem;
        background: #0f3460;
        color: #ffffff;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s ease;
        margin-top: 0.5rem;
      }

      button:hover:not(:disabled) {
        background: #16213e;
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .footer-link {
        text-align: center;
        margin: 1.5rem 0 0;
        font-size: 0.85rem;
        color: #6b7280;
      }

      .footer-link a {
        color: #0f3460;
        font-weight: 600;
        text-decoration: none;
      }

      .footer-link a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  confirmPassword = '';
  loading = false;

  get buttonText(): string {
    return this.loading ? 'Creando cuenta...' : 'Registrarme';
  }

  onSubmit(): void {
    if (!this.email.trim() || !this.password || !this.confirmPassword) {
      this.notify.warning('Todos los campos son obligatorios');
      return;
    }

    if (this.password.length < 6) {
      this.notify.warning('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.notify.warning('Las contraseñas no coinciden');
      return;
    }

    this.loading = true;
    this.auth.register(this.email.trim(), this.password, this.confirmPassword).subscribe({
      next: () => {
        this.loading = false;
        this.notify.success('Cuenta creada. Ahora iniciá sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          this.notify.error('El email ya está registrado');
        } else if (err.status === 0) {
          this.notify.error('No se pudo conectar con el servidor');
        } else {
          this.notify.error(err.error?.message || 'Error al crear la cuenta');
        }
      },
    });
  }
}
