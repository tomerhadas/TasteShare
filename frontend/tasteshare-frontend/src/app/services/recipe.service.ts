import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecipeDto, CreateRecipeDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private readonly apiUrl = 'https://localhost:7261/api/recipes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RecipeDto[]> {
    return this.http.get<RecipeDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<RecipeDto> {
    return this.http.get<RecipeDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateRecipeDto): Observable<RecipeDto> {
    return this.http.post<RecipeDto>(this.apiUrl, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
