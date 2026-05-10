import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  readonly user = this.auth.currentUser;

  readonly menuItems = [
    { label: 'Asignar Comisión', link: '/dashboard/asignar-comision', icon: '📋' },
    { label: 'Agendar Comisión', link: '/dashboard/agendar-comision', icon: '📅' },
    { label: 'Consultar Agenda', link: '/dashboard/consultar-agenda', icon: '🔍' },
  ];

  logout(): void {
    this.auth.logout();
  }
}
