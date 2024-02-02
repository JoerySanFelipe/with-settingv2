import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Users } from './models/users';
import { user } from 'rxfire/auth';
import { AuditLogService } from './services/audit-log.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'agritech-web';
  constructor(
    private authService: AuthService,
    private router: Router,
    private auditLogService: AuditLogService
  ) {}
  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((value) => {
      if (value != null) {
        this.getUserInfo(value.uid);
      } else {
        this.router.navigate(['login']);
      }
    });
  }

  getUserInfo(uid: string) {
    this.authService.getUserAccount(uid).then((value) => {
      if (value.exists()) {
        const users: Users = value.data();
        this.authService.setUser(users);
        this.identifyUser(users.type);
      } else {
        this.authService.logout();
      }
    });
  }
  identifyUser(type: string) {
    if (type === 'admin') {
      this.router.navigate(['admin']);
    } else if (type === 'staff') {
      this.router.navigate(['staff']);
    } else if (type === 'driver') {
      this.router.navigate(['profile']);
    } else {
      this.router.navigate(['notfound']);
    }
  }
}
