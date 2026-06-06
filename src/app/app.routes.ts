import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    children: [
      { path: '', redirectTo: 'asignar-comision', pathMatch: 'full' },
      {
        path: 'asignar-comision',
        loadComponent: () =>
          import('./pages/asignar-comision.component').then(
            (m) => m.AsignarComisionComponent
          ),
      },
      {
        path: 'agendar-comision',
        loadComponent: () =>
          import('./pages/agendar-comision.component').then(
            (m) => m.AgendarComisionComponent
          ),
      },
      {
        path: 'consultar-agenda',
        loadComponent: () =>
          import('./pages/consultar-agenda.component').then(
            (m) => m.ConsultarAgendaComponent
          ),
      },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
