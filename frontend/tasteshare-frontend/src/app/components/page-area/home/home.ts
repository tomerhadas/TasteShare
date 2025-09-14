import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  providers: [AuthService]
})
export class Home {
  isAuthenticated = false;

  constructor(private authService: AuthService) {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.authService.currentUser$.subscribe(() => {
      this.isAuthenticated = this.authService.isLoggedIn();
    });
  }
}
