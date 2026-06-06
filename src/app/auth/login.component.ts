import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotificationService);

  email = '';
  password = '';
  loading = false;

  get buttonText(): string {
    return this.loading ? 'Iniciando sesión...' : 'Ingresar';
  }

  onSubmit(): void {
    if (!this.email.trim() || !this.password.trim()) {
      this.notify.warning('Email y contraseña son obligatorios');
      return;
    }

    this.loading = true;
    this.auth.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
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
