import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common'; // ← הוספנו NgIf מפורשות
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CreateUserDto, UserDto } from '../../../models';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, NgIf, // ← חשוב כדי לפתור את השגיאה של *ngIf
    FormsModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSnackBarModule, MatProgressBarModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  dto: CreateUserDto = { username: '', email: '', password: '' };
  user?: UserDto;
  errorMessage = '';
  successMessage = '';
  loading = false;
  hidePassword = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  // --- UI only: password strength ---
  get passwordStrengthScore(): number {
    const p = this.dto.password || '';
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
    if (/\d/.test(p) || /[^A-Za-z0-9]/.test(p)) score++;
    return Math.min(score, 3);
  }
  get passwordStrengthLabel(): 'Weak' | 'Medium' | 'Strong' | '' {
    switch (this.passwordStrengthScore) {
      case 1: return 'Weak';
      case 2: return 'Medium';
      case 3: return 'Strong';
      default: return '';
    }
  }

  register() {
    if (!this.dto.username || !this.dto.email || !this.dto.password) {
      this.errorMessage = 'Please fill all fields';
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    this.userService.register(this.dto).subscribe({
      next: (res) => {
        this.snackBar.open('Registered successfully! Signing you in…', 'Close', {
          duration: 2000, horizontalPosition: 'center', verticalPosition: 'bottom',
        });
        this.userService.login({ email: this.dto.email, password: this.dto.password })
          .subscribe({
            next: (token: string) => {
              localStorage.setItem('authToken', token);
              try {
                const parts = token.split('.');
                if (parts.length === 3) {
                  const payload = JSON.parse(atob(parts[1]));
                  const user = {
                    id: payload.nameid || 0,
                    username: payload.unique_name || this.dto.username,
                    email: payload.email || this.dto.email,
                    role: payload.role || 'Member',
                  };
                  localStorage.setItem('current_user', JSON.stringify(user));
                }
              } catch {}
              this.router.navigate(['/recipes']);
            },
            error: () => {
              this.snackBar.open('Registered! Please sign in.', 'Close', { duration: 3000 });
              this.router.navigate(['/login']);
            },
          });
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.errorMessage = 'Registration failed. Please try again.';
        this.loading = false;
        this.snackBar.open(this.errorMessage, 'Close', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'bottom',
        });
      },
      complete: () => { this.loading = false; },
    });
  }
}
