import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,

    private router: Router,
    public loadingService: LoadingService,
    private toaster: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onLogin() {
    console.log(this.authService.getCurrentUser());
    const formData = this.loginForm.value;
    this.loadingService.showLoading('login');
    this.authService
      .login(formData.email, formData.password)
      .then((value) => {
        this.router.navigate(['']);
        this.toaster.success('Successfully Logged in!', 'Welcome!', {
          timeOut: 1000,
        });
      })
      .catch((err) => {
        console.log(err.message);
        this.toaster.error(err.message, 'Error', {
          timeOut: 2000,
        });
      })
      .finally(() => {
        this.loadingService.hideLoading('login');
      });
  }
}
