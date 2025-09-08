import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { UserDto } from '../../../models';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressBarModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  dto = { email: '', password: '' };
  user?: UserDto;
  errorMessage = '';
  loading = false;
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private userService: UserService, // Added direct user service
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  login() {
    if (!this.dto.email || !this.dto.password) {
      this.errorMessage = 'יש למלא את כל השדות';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Try direct API call without interceptors to see what the response truly is
    console.log('Login attempt with credentials:', { email: this.dto.email });

    // DIRECT APPROACH: Using UserService with text responseType
    this.userService.login(this.dto).subscribe({
      next: (token: string) => {
        console.log('Login success - received token:', token);

        // Store the JWT token directly
        localStorage.setItem('authToken', token);

        // Try to decode the JWT token for user info
        try {
          // JWT token has 3 parts: header.payload.signature
          const parts = token.split('.');
          if (parts.length === 3) {
            // Decode the middle part (payload)
            const payload = JSON.parse(atob(parts[1]));
            console.log('Decoded token payload:', payload);

            // Store user data if available
            if (payload.nameid || payload.unique_name || payload.email) {
              const user = {
                id: payload.nameid || 0,
                username: payload.unique_name || this.dto.email.split('@')[0],
                email: payload.email || this.dto.email,
                role: payload.role || 'Member',
              };
              localStorage.setItem('current_user', JSON.stringify(user));
            }
          }
        } catch (e) {
          console.error('Error parsing JWT token:', e);
        }

        this.snackBar.open('התחברת בהצלחה!', 'סגור', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        this.router.navigate(['/']); // redirect to home
      },
      error: (error: HttpErrorResponse) => {
        console.error('Login error details:', error);

        // Display detailed debug info
        console.log('Error status:', error.status);
        console.log('Error type:', typeof error);
        console.log('Error body:', error.error);

        // Check for different error types and provide appropriate messages
        if (error.status === 401) {
          this.errorMessage = 'שם משתמש או סיסמה שגויים. נסה שוב.';
        } else if (error.status === 0) {
          this.errorMessage = 'לא ניתן להתחבר לשרת. בדוק את החיבור לאינטרנט.';
        } else {
          this.errorMessage = 'התחברות נכשלה. אנא נסה שוב.';
        }

        // Show error in snackbar for better visibility
        this.snackBar.open(this.errorMessage, 'סגור', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });

        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
