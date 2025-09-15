import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminUsersService {
  private baseApiUrl = 'https://localhost:7261/api';
  private usersApiUrl = `${this.baseApiUrl}/users`;
  private adminApiUrl = `${this.baseApiUrl}/admin/users`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.usersApiUrl);
  }

  deleteUser(userId: number): Observable<void> { 
         const currentUser = this.authService.getCurrentUser();
      console.log('Current user:', currentUser);
      console.log('Is admin:', currentUser?.role === 'Admin');
      console.log('Deleting user with ID:', userId);

      // Try the standard users endpoint first
      const url = `${this.usersApiUrl}/${userId}`;
      console.log('Delete URL:', url);

      
    return this.http.delete<void>(`${this.usersApiUrl}/delete/${userId}`);
  }
}
