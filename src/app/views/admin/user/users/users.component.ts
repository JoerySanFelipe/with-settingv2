import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  _users: Observable<Users[]>;

  constructor(private authService: AuthService) {
    this._users = new Observable<Users[]>();
  }
  ngOnInit(): void {
    this._users = this.authService.getAllUsers();
  }
}
