import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Skip auth header for login and register requests
    const isAuthRequest =
      request.url.includes('/api/users/login') ||
      request.url.includes('/api/users/register');

    // Get the token
    const token = this.authService.getToken();

    console.log('Request URL:', request.url);
    console.log('Is auth request:', isAuthRequest);
    console.log('Token exists:', !!token);

    // If token exists and this is not an auth request, add it to the request headers
    if (token && !isAuthRequest) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Added auth header to request');
    }

    // Continue with the modified request
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors - token expired or invalid
        if (error.status === 401) {
          this.authService.logout();
          this.snackBar.open('פג תוקף החיבור, אנא התחבר מחדש', 'סגור', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          this.router.navigate(['/login']);
        }

        // Handle 403 Forbidden errors
        if (error.status === 403) {
          this.snackBar.open('אין לך הרשאות לבצע פעולה זו', 'סגור', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }

        return throwError(() => error);
      })
    );
  }
}
