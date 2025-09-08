import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserDto, LoginDto } from '../models';
import { AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'https://localhost:7261/api/users';
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  constructor(private http: HttpClient, private router: Router) {
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
    // First, try with the expected response type
    console.log('Attempting login with:', credentials);

    // Try multiple approaches - first with JSON response type
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      map((response: any) => {
        console.log('Login response (JSON):', response);

        // Handle token based on response format
        let token = '';

        if (typeof response === 'string') {
          // Direct token string
          token = response;
        } else if (response && response.token) {
          // Object with token property
          token = response.token;
        } else {
          console.error('Unexpected response format:', response);
          throw new Error('Unexpected response format from server');
        }

        // Store the token
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem('authToken', token); // For backward compatibility

        // Decode the JWT token to extract user info
        // We can't do full JWT decoding without a library, but we can extract basic info
        try {
          const payload = JSON.parse(atob(response.split('.')[1]));
          console.log('Decoded token payload:', payload);

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
            token: response,
            user: user,
          };
        } catch (e) {
          console.error('Error decoding token:', e);
          // Even if we can't decode the token, still consider login successful
          const user: UserDto = {
            id: 0,
            username: credentials.email.split('@')[0],
            email: credentials.email,
            role: 'Member',
          };
          localStorage.setItem(this.userKey, JSON.stringify(user));
          this.currentUserSubject.next(user);
          return { token: response, user: user };
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
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
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    // Check both storage locations with authToken taking priority
    return (
      localStorage.getItem('authToken') || localStorage.getItem(this.tokenKey)
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): UserDto | null {
    return this.currentUserSubject.value;
  }

  // Method to check if user is admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user !== null && user.role === 'Admin';
  }
}
