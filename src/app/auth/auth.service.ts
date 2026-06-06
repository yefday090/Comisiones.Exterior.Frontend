import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RefreshResponse, UserProfile } from './auth.models';
import { NotificationService } from '../services/notification.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private readonly notify = inject(NotificationService);

  readonly isAuthenticated = signal(false);
  readonly currentUser = signal<string | null>(null);
  readonly accessToken = signal<string | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {
    this.restoreSession();
  }

  // ── Public API ──────────────────────────────

  login(email: string, password: string): Observable<LoginResponse> {
    const body: LoginRequest = { email, password };
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, body).pipe(
      tap((res) => this.handleAuthSuccess(res)),
      catchError((err) => {
        this.clearAuth();
        return throwError(() => err);
      }),
    );
  }

  register(email: string, password: string, confirmPassword: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, {
      email,
      password,
      confirmPassword,
    });
  }

  refreshToken(): Observable<RefreshResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    return this.http
      .post<RefreshResponse>(`${this.baseUrl}/refresh`, { refreshToken })
      .pipe(
        tap((res) => this.storeTokens(res.accessToken, res.refreshToken)),
        catchError((err) => {
          this.logout();
          return throwError(() => err);
        }),
      );
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/me`);
  }

  logout(): void {
    const token = localStorage.getItem('refresh_token');
    if (token) {
      this.http.post(`${this.baseUrl}/logout`, { refreshToken: token }).subscribe();
    }
    this.clearAuth();
    this.notify.info('Sesión cerrada');
    this.router.navigate(['/login']);
  }

  // ── Token helpers ───────────────────────────

  getAccessToken(): string | null {
    return this.accessToken() ?? localStorage.getItem('access_token');
  }

  private handleAuthSuccess(res: LoginResponse): void {
    this.storeTokens(res.accessToken, res.refreshToken);
    this.isAuthenticated.set(true);
    this.currentUser.set(this.decodeEmail(res.accessToken));
    this.notify.success('Inicio de sesión exitoso');
    this.router.navigate(['/dashboard']);
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    this.accessToken.set(accessToken);
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  private clearAuth(): void {
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.accessToken.set(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private restoreSession(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.accessToken.set(token);
      this.isAuthenticated.set(true);
      this.currentUser.set(this.decodeEmail(token));
    }
  }

  private decodeEmail(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return (
        payload.email ??
        payload.sub ??
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ??
        'Usuario'
      );
    } catch {
      return 'Usuario';
    }
  }
}
