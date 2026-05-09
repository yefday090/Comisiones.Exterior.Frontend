import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly isAuthenticated = signal(false);
  readonly currentUser = signal<string | null>(null);

  // Credenciales de demo (cambiar por API real después)
  private readonly demoUser = 'admin';
  private readonly demoPassword = 'admin123';

  constructor(private readonly router: Router) {
    this.checkSession();
  }

  login(username: string, password: string): boolean {
    if (username === this.demoUser && password === this.demoPassword) {
      this.isAuthenticated.set(true);
      this.currentUser.set(username);
      sessionStorage.setItem('auth_user', username);
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    sessionStorage.removeItem('auth_user');
    this.router.navigate(['/login']);
  }

  private checkSession(): void {
    const saved = sessionStorage.getItem('auth_user');
    if (saved) {
      this.isAuthenticated.set(true);
      this.currentUser.set(saved);
    }
  }
}
