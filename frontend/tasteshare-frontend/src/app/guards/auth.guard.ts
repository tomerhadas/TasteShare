import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  // ⚡ בינתיים נשמור token ב-localStorage אחרי login
  const token = localStorage.getItem('authToken');

  if (token) {
    return true; // מותר להיכנס
  }

  // אם לא מחובר -> נשלח ל-login
  router.navigate(['/login']);
  return false;
};
