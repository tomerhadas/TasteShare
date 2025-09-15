import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserDto, LoginDto } from '../models';
import { AuthResponse } from '../models/auth.model';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'https://localhost:7261/api/users';
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  constructor(
    private http: HttpClient,
    private router: Router,
    private env: EnvironmentService
  ) {
    // Load user from localStorage on service initialization
    const storedUser = localStorage.getItem(this.userKey);
    const token = localStorage.getItem(this.tokenKey);

    if (storedUser && token) {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.tokenKey);
      }
    }
  }

  login(credentials: LoginDto): Observable<any> {
    // Only log non-sensitive information
    this.env.devLog('Attempting login');

    // Try multiple approaches - first with JSON response type
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      map((response: any) => {
        this.env.devLog('Login response received');

        // Handle token based on response format
        let token = '';

        if (typeof response === 'string') {
          // Direct token string
          token = response;
        } else if (response && response.token) {
          // Object with token property
          token = response.token;
        } else {
          this.env.errorLog('Unexpected response format from server');
          throw new Error('Unexpected response format from server');
        }

        // Store the token
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem('authToken', token); // For backward compatibility

        // Decode the JWT token to extract user info
        // We can't do full JWT decoding without a library, but we can extract basic info
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.env.devLog('Token decoded successfully');

          // Create user from token claims
          const user: UserDto = {
            id: payload.id || 0,
            username: payload.name || payload.email,
            email: payload.email || credentials.email,
            role: payload.role || 'Member',
          };

          localStorage.setItem(this.userKey, JSON.stringify(user));
          this.currentUserSubject.next(user);

          return {
            token: token,
            user: user,
          };
        } catch (e) {
          this.env.errorLog('Error decoding token');
          // Even if we can't decode the token, still consider login successful
          const user: UserDto = {
            id: 0,
            username: credentials.email.split('@')[0],
            email: credentials.email,
            role: 'Member',
          };
          localStorage.setItem(this.userKey, JSON.stringify(user));
          this.currentUserSubject.next(user);
          return { token: token, user: user };
        }
      }),
      catchError((error) => {
        this.env.errorLog('Login error');
        return throwError(
          () => new Error('שם משתמש או סיסמה שגויים. נסה שוב.')
        );
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      catchError((error) => {
        console.error('Registration error:', error);
        if (error.status === 400) {
          return throwError(
            () =>
              new Error(
                'כתובת האימייל כבר בשימוש או שהנתונים שהוזנו אינם תקינים.'
              )
          );
        }
        return throwError(() => new Error('אירעה שגיאה בהרשמה. אנא נסה שוב.'));
      })
    );
  }

  logout(): void {
    // Clear all auth-related storage
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem('authToken'); // Clear alternative token storage

    // Also check session storage in case tokens are stored there
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem('authToken');

    // Reset the auth state
    this.currentUserSubject.next(null);

    this.env.devLog('User logged out successfully');

    // Navigate to login page
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    // Check both storage locations with authToken taking priority
    return (
      localStorage.getItem('authToken') || localStorage.getItem(this.tokenKey)
    );
  }

  // מתודה חדשה לעדכון המשתמש מבחוץ (לשימוש ע"י Login component)
  updateUserAfterLogin(user: UserDto): void {
    console.log('AuthService: Updating user after external login', user);

    // שמירת המשתמש ב-localStorage (למקרה שעדיין לא נשמר שם)
    localStorage.setItem(this.userKey, JSON.stringify(user));

    // עדכון ה-BehaviorSubject
    this.currentUserSubject.next(user);

    // בדיקה שהעדכון התבצע בהצלחה
    console.log(
      'Current user in subject after update:',
      this.currentUserSubject.value
    );

    // פרסום אירוע מיוחד שמסמן שהמשתמש התעדכן (גם דרך document וגם דרך window)
    const userEvent = new CustomEvent('userLoggedIn', { detail: user });
    document.dispatchEvent(userEvent);
    window.dispatchEvent(userEvent);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): UserDto | null {
    // If we have a token but no user object, try to load from localStorage
    if (this.isLoggedIn() && !this.currentUserSubject.value) {
      const storedUser = localStorage.getItem(this.userKey);
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          this.currentUserSubject.next(user);
          this.env.devLog('User loaded from localStorage');
        } catch (e) {
          this.env.errorLog('Error parsing stored user');
          // If we can't parse the stored user but have a token,
          // try to reconstruct a basic user object
          this.reconstructUserFromToken();
        }
      } else {
        // If we don't have a stored user but have a token,
        // try to reconstruct a user from the token
        this.reconstructUserFromToken();
      }
    }
    return this.currentUserSubject.value;
  }

  // Helper method to try reconstructing user data from the token if possible
  private reconstructUserFromToken(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      // Try to extract user info from JWT token
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        this.env.devLog('Token decoded for user reconstruction');

        // Create minimal user from token claims
        const user: UserDto = {
          id: payload.id || payload.nameid || 0,
          username: payload.name || payload.email || 'User',
          email: payload.email || '',
          role: payload.role || 'Member',
        };

        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.env.devLog('User reconstructed from token');
      }
    } catch (e) {
      this.env.errorLog('Failed to reconstruct user from token');
    }
  }

  // Method to check if user is admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user !== null && user.role === 'Admin';
  }
}
