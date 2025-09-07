import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // 👈 כאן
import { UserService } from '../../../services/user.service';
import { CreateUserDto, UserDto } from '../../../models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],  // 👈 כאן
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  dto: CreateUserDto = { username: '', email: '', password: '' };
  user?: UserDto;
  errorMessage = '';
  successMessage = '';

  constructor(private userService: UserService) {}

  register() {
    this.userService.register(this.dto).subscribe({
      next: (res) => {
        this.user = res;
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';
        this.dto = { username: '', email: '', password: '' };
      },
      error: () => {
        this.errorMessage = 'Registration failed. Please try again.';
        this.successMessage = '';
      }
    });
  }
}
