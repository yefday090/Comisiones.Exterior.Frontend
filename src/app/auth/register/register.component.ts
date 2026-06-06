import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AuthService } from '../auth.service';
import { NotificationService } from '../../services/notification.service';

interface PasswordRules {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasDigit: boolean;
  hasSpecial: boolean;
}

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, NgClass],
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
            <div class="password-wrapper">
              <input
                id="password"
                name="password"
                type="password"
                [(ngModel)]="password"
                (ngModelChange)="onPasswordChange()"
                (focus)="showRules = true"
                (blur)="showRules = false"
                placeholder="Mínimo 6 caracteres"
                autocomplete="new-password"
                required
              />

              <!-- Strength bar -->
              @if (password) {
                <div class="strength-bar">
                  <div class="strength-fill" [ngClass]="strengthClass" [style.width.%]="strengthPercent"></div>
                </div>
              }

              <!-- Rules popup -->
              @if (showRules && password && !allRulesMet) {
                <div class="rules-popup">
                <div class="rules-title">Requisitos de seguridad</div>
                <div class="rule" [ngClass]="{ met: rules.minLength }">
                  <span class="rule-icon">{{ rules.minLength ? '✅' : '○' }}</span>
                  Mínimo 6 caracteres
                </div>
                <div class="rule" [ngClass]="{ met: rules.hasUpper }">
                  <span class="rule-icon">{{ rules.hasUpper ? '✅' : '○' }}</span>
                  Al menos una mayúscula
                </div>
                <div class="rule" [ngClass]="{ met: rules.hasLower }">
                  <span class="rule-icon">{{ rules.hasLower ? '✅' : '○' }}</span>
                  Al menos una minúscula
                </div>
                <div class="rule" [ngClass]="{ met: rules.hasDigit }">
                  <span class="rule-icon">{{ rules.hasDigit ? '✅' : '○' }}</span>
                  Al menos un número
                </div>
                <div class="rule" [ngClass]="{ met: rules.hasSpecial }">
                  <span class="rule-icon">{{ rules.hasSpecial ? '✅' : '○' }}</span>
                  Un carácter especial (&#64;#$%&)
                </div>
                </div>
              }
            </div>
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
            @if (confirmPassword) {
              <div class="rule" [ngClass]="{ met: password && password === confirmPassword }">
                {{ password && password === confirmPassword ? '✅' : '○' }} Las contraseñas coinciden
              </div>
            }
          </div>

          <button type="submit" [disabled]="loading || form.invalid || !allRulesMet">
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
        max-width: 420px;
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

      /* ── Strength Bar ─────────────────────── */
      .strength-bar {
        height: 4px;
        background: #e5e7eb;
        border-radius: 2px;
        margin-top: 0.6rem;
        overflow: hidden;
      }

      .strength-fill {
        height: 100%;
        border-radius: 2px;
        transition: width 0.3s ease, background-color 0.3s ease;
      }

      .strength-weak {
        background-color: #dc2626;
      }

      .strength-medium {
        background-color: #f59e0b;
      }

      .strength-good {
        background-color: #16a34a;
      }

      .strength-strong {
        background-color: #15803d;
      }

      /* ── Password Wrapper ─────────────────── */
      .password-wrapper {
        position: relative;
      }

      /* ── Rules Popup ──────────────────────── */
      .rules-popup {
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 0;
        right: 0;
        background: #1a1a2e;
        color: #e5e7eb;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        z-index: 10;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        animation: fadeIn 0.15s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .rules-title {
        font-size: 0.75rem;
        font-weight: 700;
        color: #7dd3fc;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 0.25rem;
      }

      .rule {
        font-size: 0.8rem;
        color: #9ca3af;
        display: flex;
        align-items: center;
        gap: 0.4rem;
      }

      .rule-icon {
        font-size: 0.85rem;
        width: 1.1rem;
        text-align: center;
        flex-shrink: 0;
      }

      .rule.met {
        color: #6ee7b7;
      }

      /* ── Button ───────────────────────────── */
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
  showRules = false;

  rules: PasswordRules = {
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasDigit: false,
    hasSpecial: false,
  };

  get buttonText(): string {
    return this.loading ? 'Creando cuenta...' : 'Registrarme';
  }

  get rulesMetCount(): number {
    return Object.values(this.rules).filter(Boolean).length;
  }

  get strengthPercent(): number {
    return (this.rulesMetCount / 5) * 100;
  }

  get strengthClass(): string {
    if (this.rulesMetCount <= 1) return 'strength-weak';
    if (this.rulesMetCount <= 2) return 'strength-medium';
    if (this.rulesMetCount <= 4) return 'strength-good';
    return 'strength-strong';
  }

  get allRulesMet(): boolean {
    return this.rulesMetCount >= 4;
  }

  onPasswordChange(): void {
    const pwd = this.password || '';
    this.rules = {
      minLength: pwd.length >= 6,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasDigit: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/]/.test(pwd),
    };
  }

  onSubmit(): void {
    if (!this.email.trim() || !this.password || !this.confirmPassword) {
      this.notify.warning('Todos los campos son obligatorios');
      return;
    }

    if (!this.allRulesMet) {
      this.notify.warning('La contraseña no cumple con los requisitos de seguridad');
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
