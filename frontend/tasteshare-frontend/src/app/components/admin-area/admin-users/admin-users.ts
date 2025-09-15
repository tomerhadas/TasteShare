import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminUsersService } from '../../../services/admin-users.service';
import { UserDto } from '../../../models/user.model';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltip,
  ],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css'],
})
export class AdminUsers implements OnInit {
  users: UserDto[] = [];
  loading = false;
  error = '';
  displayedColumns: string[] = [
    'id',
    'username',
    'email',
    'role',
    'createdAt',
    'actions',
  ];

  constructor(
    private adminUsersService: AdminUsersService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminUsersService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'שגיאה בטעינת רשימת המשתמשים';
        this.loading = false;
        console.error(err);
      },
    });
  }

  deleteUser(userId: number): void {
    if (confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
      console.log('Attempting to delete user with ID:', userId);
      this.adminUsersService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter((user) => user.id !== userId);
          this.snackBar.open('המשתמש נמחק בהצלחה', 'סגור', {
            duration: 3000,
          });
        },
        error: (err) => {
          this.snackBar.open('שגיאה במחיקת המשתמש', 'סגור', {
            duration: 5000,
          });
          console.error('Error deleting user:', err);
        },
      });
    }
  }
}
