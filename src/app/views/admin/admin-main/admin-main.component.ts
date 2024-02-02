import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css'],
})
export class AdminMainComponent {
  constructor(private authService: AuthService) {}
  logout() {
    this.authService.logout();
  }
}
