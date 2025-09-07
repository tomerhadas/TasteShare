import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  isLoggedIn = false;

  constructor(private router: Router) {} // 👈 inject Router here

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']); // now works
  }
}
