import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto, CreateUserDto, LoginDto } from '../models'; // נוסיף גם את LoginDto

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'https://localhost:7261/api/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/${id}`);
  }

  register(dto: CreateUserDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}/register`, dto);
  }

  login(dto: LoginDto): Observable<string> {
    // Add Content-Type header explicitly and set responseType to text
    const headers = { 'Content-Type': 'application/json' };
    console.log('Raw login attempt with:', dto);
    return this.http.post(`${this.apiUrl}/login`, dto, {
      headers,
      responseType: 'text', // Critical: get the raw token string, not JSON
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
