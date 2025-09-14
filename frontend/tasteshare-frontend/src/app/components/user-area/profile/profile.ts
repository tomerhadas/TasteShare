import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';   // 👈 חייבים לייבא
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule], // 👈 הוספתי CommonModule
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile {
  constructor(public authService: AuthService) {}
}
