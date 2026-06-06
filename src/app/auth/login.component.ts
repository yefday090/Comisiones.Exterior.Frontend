import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha-2';
import { AuthService } from './auth.service';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, RecaptchaModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotificationService);

  email = '';
  password = '';
  loading = false;
  captchaToken: string | null = null;
  readonly siteKey = environment.recaptchaSiteKey;

  get buttonText(): string {
    return this.loading ? 'Iniciando sesión...' : 'Ingresar';
  }

  onCaptchaResolved(token: string | null): void {
    this.captchaToken = token;
  }

  onSubmit(): void {
    if (!this.email.trim() || !this.password.trim()) {
      this.notify.warning('Email y contraseña son obligatorios');
      return;
    }

    if (!this.captchaToken) {
      this.notify.warning('Completá el captcha');
      return;
    }

    this.loading = true;
    this.auth.login(this.email.trim(), this.password, this.captchaToken).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.captchaToken = null;
        if (err.status === 401) {
          this.notify.error('Email o contraseña incorrectos');
        } else if (err.status === 0 || err.status === 504) {
          this.notify.error('No se pudo conectar con el servidor. Verificá que el backend esté corriendo.');
        } else {
          this.notify.error(err.error?.message || 'Error al iniciar sesión');
        }
      },
    });
  }
}
