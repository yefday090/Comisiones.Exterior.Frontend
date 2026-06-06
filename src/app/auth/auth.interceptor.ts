import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const notify = inject(NotificationService);
  const token = auth.getAccessToken();

  // Skip interceptor for unauthenticated auth endpoints
  const publicPaths = ['/auth/login', '/auth/register', '/auth/refresh'];
  if (publicPaths.some((path) => req.url.includes(path))) {
    return next(req);
  }

  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      // Network error
      if (error.status === 0) {
        notify.error('Error de conexión. Verificá tu red o el servidor.');
        return throwError(() => error);
      }

      // Try refresh on 401
      if (error.status === 401 && token) {
        return auth.refreshToken().pipe(
          switchMap(() => {
            const newToken = auth.getAccessToken();
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retryReq);
          }),
          catchError(() => {
            auth.logout();
            notify.warning('Sesión expirada. Iniciá sesión nuevamente.');
            return throwError(() => error);
          }),
        );
      }

      // Server errors
      if (error.status >= 500) {
        notify.error('Error del servidor. Intentá de nuevo más tarde.');
      }

      return throwError(() => error);
    }),
  );
};
