import { Location } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Users } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  _users: Users | null = null;
  constructor(
    private authService: AuthService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((value) => {
      if (value !== null) {
        this.getUserInfo(value.uid);
      }
    });
  }
  getUserInfo(uid: string) {
    this.authService.getUserAccount(uid).then((value) => {
      console.log(value);
      if (value.exists()) {
        const users: Users = value.data();
        this._users = users;
        this.cdr.detectChanges();
      }
    });
  }
  logout() {
    this.authService.logout();
    this.location.back();
  }
}
