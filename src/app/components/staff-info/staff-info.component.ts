import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Users } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-staff-info',
  templateUrl: './staff-info.component.html',
  styleUrls: ['./staff-info.component.css'],
})
export class StaffInfoComponent implements OnInit {
  @Input() staffID: string = '';
  _users: Users | null = null;
  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.getUserInfo(this.staffID);
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
}
