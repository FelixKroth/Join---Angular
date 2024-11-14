// login.component.ts
import { Component } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { from } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  errorMessage: string = '';
  isSignup: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode() {
    this.isSignup = !this.isSignup;
    this.errorMessage = '';
  }

  submit() {
    if (this.isSignup) {
      if (!this.firstName || !this.lastName) {
        this.errorMessage = "First and Last Name are required!";
        return;
      }

      from(this.authService.signup(this.email, this.password, this.firstName, this.lastName))
        .subscribe({
          next: () => this.router.navigate(['/summary']),
          error: (error: { message: string }) => this.errorMessage = error.message
        });
    } else {
      from(this.authService.login(this.email, this.password))
        .subscribe({
          next: () => this.router.navigate(['/summary']),
          error: (error: { message: string }) => this.errorMessage = error.message
        });
    }
  }

  guestLogin() {
    from(this.authService.guestLogin()).subscribe({
      next: () => this.router.navigate(['/summary']),
      error: (error: { message: string }) => this.errorMessage = error.message
    });
  }
}
