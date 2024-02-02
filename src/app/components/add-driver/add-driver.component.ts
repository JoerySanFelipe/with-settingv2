import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css'],
})
export class AddDriverComponent implements OnInit {
  _drivers: Observable<Users[]>;
  constructor(private authService: AuthService) {
    this._drivers = new Observable<Users[]>();
  }
  ngOnInit(): void {
    this._drivers = this.authService.getAllDrivers();
  }
  @Output() onSelectDriver = new EventEmitter<Users>();

  selectDriver(data: Users) {
    this.onSelectDriver.emit(data);
  }
}
