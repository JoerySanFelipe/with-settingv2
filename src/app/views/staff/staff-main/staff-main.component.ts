import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-staff-main',
  templateUrl: './staff-main.component.html',
  styleUrls: ['./staff-main.component.css'],
})
export class StaffMainComponent {
  constructor(public authService: AuthService) {}
}
