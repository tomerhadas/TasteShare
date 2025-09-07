import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { UserDto } from '../../../models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  dto = { email: '', password: '' };
  user?: UserDto;
  errorMessage = '';
  router: any;

  constructor(private userService: UserService) {}

  login() {
    this.userService.login(this.dto).subscribe({
next: (res: any) => {
  // make sure the backend really sends { token: "..." }
  localStorage.setItem('authToken', String(res.token));

  this.router.navigate(['/']); // redirect to home
},
      error: () => {
        this.errorMessage = 'Login failed. Please try again.';
      },
    });
  }
}
