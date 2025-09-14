import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RecipeDto, CreateRecipeDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly apiUrl = 'https://localhost:7261/api/recipes';

  constructor(private http: HttpClient) {}

  // בדיקה אם המשתמש מחובר
  checkAuth(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-recipes`).pipe(
      catchError((error) => {
        console.error('Auth check failed:', error);
        return throwError(() => error);
      })
    );
  }

  getAll(): Observable<RecipeDto[]> {
    return this.http.get<RecipeDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<RecipeDto> {
    return this.http.get<RecipeDto>(`${this.apiUrl}/${id}`);
  }

  getMyRecipes(): Observable<RecipeDto[]> {
    return this.http.get<RecipeDto[]>(`${this.apiUrl}/my-recipes`);
  }

  create(dto: CreateRecipeDto): Observable<RecipeDto> {
    return this.http.post<RecipeDto>(this.apiUrl, dto);
  }

  update(id: number, dto: CreateRecipeDto): Observable<RecipeDto> {
    console.log('Updating recipe with ID:', id, 'Payload:', dto);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .put<RecipeDto>(`${this.apiUrl}/${id}`, dto, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error updating recipe:', error);

          if (error.status === 405) {
            return throwError(
              () =>
                new Error(
                  'API does not support PUT method for updates. Please contact the administrator.'
                )
            );
          }

          if (error.status === 401) {
            return throwError(
              () => new Error('Authentication failed. Please log in again.')
            );
          }

          if (error.status === 403) {
            return throwError(
              () =>
                new Error('You do not have permission to update this recipe.')
            );
          }

          return throwError(() => error);
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
