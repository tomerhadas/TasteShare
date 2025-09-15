import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; // ← הוספנו RouterLinkActive
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive, // ← חדש
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  isLoggedIn = false;
  username: string | null = null;
  isAdmin = false;

  constructor(private router: Router, private authService: AuthService) {
    // בדיקה מיידית במקרה שהמשתמש כבר מחובר
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('current_user');
    console.log('Navbar constructor - token exists:', !!token);
    console.log('Navbar constructor - user exists:', !!userStr);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('Navbar constructor - parsed user:', user);
        this.isLoggedIn = true;
        this.username = user.username;
        this.isAdmin = user.role === 'Admin';
      } catch (e) {
        console.error('Error parsing stored user data:', e);
      }
    }
  }

  ngOnInit() {
    // הקשבה לשינויים במצב המשתמש (כולל לאחר התחברות/התנתקות)
    this.authService.currentUser$.subscribe((user) => {
      console.log('Navbar: User state changed', user);
      this.isLoggedIn = !!user;
      this.username = user?.username || user?.email?.split('@')[0] || null;
      this.isAdmin = user?.role === 'Admin' || this.authService.isAdmin();

      // לוג נוסף לבדיקה
      console.log('Updated navbar state:', {
        isLoggedIn: this.isLoggedIn,
        username: this.username,
        isAdmin: this.isAdmin,
      });
    });

    // מאזין גם לאירועי התחברות מותאמים
    window.addEventListener('userLoggedIn', () => {
      console.log('Auth state changed via custom event');
      setTimeout(() => this.updateUserState(), 100); // קצת השהייה לאפשר לכל העדכונים להתבצע
    });

    // בדיקה תקופתית של מצב ההתחברות (למקרה שמשהו השתנה בלי שתפסנו)
    setInterval(() => {
      const wasLoggedIn = this.isLoggedIn;
      const currentUsername = this.username;
      this.updateUserState();

      // רק אם מצב המשתמש השתנה, נדפיס הודעת דיבאג
      if (
        wasLoggedIn !== this.isLoggedIn ||
        currentUsername !== this.username
      ) {
        console.log('Auth state updated during periodic check:', {
          wasLoggedIn,
          currentUsername,
          isNowLoggedIn: this.isLoggedIn,
          newUsername: this.username,
        });
      }
    }, 10000); // בדיקה כל 10 שניות

    // בדיקת מצב התחברות בעת טעינה ראשונית
    this.updateUserState();
  }

  // פונקציה לעדכון מצב המשתמש - מאפשרת קריאה חוזרת בעת הצורך
  updateUserState() {
    // קודם כל בודקים אם יש token בlocalstorage
    const token =
      localStorage.getItem('authToken') || localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('current_user');

    console.log('updateUserState - token exists:', !!token);
    console.log('updateUserState - stored user exists:', !!userStr);

    // בדיקה ישירה מול localStorage
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('updateUserState - Using user from localStorage:', user);
        this.isLoggedIn = true;
        this.username = user.username || user.email?.split('@')[0] || 'משתמש';
        this.isAdmin = user.role === 'Admin';

        // גם מעדכנים את ה-AuthService אם צריך
        if (!this.authService.getCurrentUser()) {
          this.authService.updateUserAfterLogin(user);
        }

        return;
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }

    // אם לא מצאנו מידע ב-localStorage, ננסה דרך AuthService
    this.isLoggedIn = this.authService.isLoggedIn();
    const currentUser = this.authService.getCurrentUser();

    console.log('updateUserState - AuthService.isLoggedIn():', this.isLoggedIn);
    console.log('updateUserState - AuthService.getCurrentUser():', currentUser);

    if (currentUser) {
      this.username =
        currentUser.username || currentUser.email?.split('@')[0] || 'משתמש';
      this.isAdmin = currentUser.role === 'Admin' || this.authService.isAdmin();
    } else {
      this.isLoggedIn = false;
      this.username = null;
      this.isAdmin = false;
    }

    console.log('Final navbar state:', {
      isLoggedIn: this.isLoggedIn,
      username: this.username,
    });
  }

  logout() {
    this.isLoggedIn = false;
    this.username = null;
    this.isAdmin = false;
    this.authService.logout();
  }
}
