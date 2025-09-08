import {
  ApplicationConfig,
  inject,
  makeEnvironmentProviders,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  HttpInterceptorFn,
} from '@angular/common/http';

import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

// Functional interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  // Skip auth header for login and register requests
  const isAuthRequest =
    req.url.includes('/api/users/login') ||
    req.url.includes('/api/users/register');

  // Get the token
  const token = authService.getToken();

  console.log('Interceptor - Request URL:', req.url);
  console.log('Interceptor - Is auth request:', isAuthRequest);
  console.log('Interceptor - Token exists:', !!token);

  // If token exists and this is not an auth request, add it to the request headers
  if (token && !isAuthRequest) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Interceptor - Added auth header to request');
  }

  // Continue with the modified request
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors - token expired or invalid
      if (error.status === 401) {
        authService.logout();
        snackBar.open('פג תוקף החיבור, אנא התחבר מחדש', 'סגור', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        router.navigate(['/login']);
      }

      // Handle 403 Forbidden errors
      if (error.status === 403) {
        snackBar.open('אין לך הרשאות לבצע פעולה זו', 'סגור', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }

      return throwError(() => error);
    })
  );
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
