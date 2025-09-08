import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    return true; // מותר להיכנס
  }

  // אם לא מחובר -> נשלח ל-login
  router.navigate(['/login']);
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true; // רק מנהלי מערכת יכולים להיכנס
  }

  if (authService.isLoggedIn()) {
    // מחובר אבל לא מנהל -> נשלח לדף הבית
    router.navigate(['/']);
  } else {
    // לא מחובר בכלל -> נשלח ל-login
    router.navigate(['/login']);
  }

  return false;
};
