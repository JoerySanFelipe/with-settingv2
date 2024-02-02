import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { user } from 'rxfire/auth';
import { UserType } from 'src/app/models/user-type';
import { Users } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent {
  userForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    type: new FormControl(null, [Validators.required]),
    phone: new FormControl('', [Validators.required]),
  });
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    public loadingService: LoadingService
  ) {}
  submitUser() {
    if (this.userForm.valid) {
      let email = this.userForm.controls.email.value;
      let password = this.userForm.controls.password.value;
      if (email !== null && password !== null) {
        this.signup(email, password);
      } else {
        this.toastr.error('Invalid email or password', 'error user info');
      }
    }
  }
  signup(email: string, password: string) {
    this.loadingService.showLoading('user');
    this.authService
      .createAccount(email, password)
      .then((value) => {
        let user: User = value.user;
        let userType = this.userForm.controls.type.value;
        let users: Users = {
          id: user.uid,
          name: this.userForm.controls.name.value ?? '',
          profile: '',
          phone: this.userForm.controls.phone.value ?? '',
          email: user.email ?? '',
          address: this.userForm.controls.address.value ?? '',
          type: userType === 'staff' ? UserType.STAFF : UserType.ADMIN,
        };
        this.saveAccount(users);
      })
      .catch((err) => {
        this.toastr.error(err.message, 'Error creating account');
        this.loadingService.hideLoading('user');
      });
  }
  saveAccount(user: Users) {
    this.authService
      .saveUserAccount(user)
      .then((value) => {
        this.toastr.success('new user created!', 'Successfully created');
      })
      .catch((err) => this.toastr.error(err.message, 'Error saving account'))
      .finally(() => this.loadingService.hideLoading('user'));
  }
}
