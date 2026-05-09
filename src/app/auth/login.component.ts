import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private readonly auth: AuthService) {}

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Usuario y contraseña son obligatorios';
      return;
    }

    const ok = this.auth.login(this.username.trim(), this.password);
    if (!ok) {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  }
}
