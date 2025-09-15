import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecipeDto } from '../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class AdminRecipesService {
  private apiUrl = 'https://localhost:7261/api/recipes';

  constructor(private http: HttpClient) {}

  getAllRecipes(): Observable<RecipeDto[]> {
    return this.http.get<RecipeDto[]>(this.apiUrl);
  }

  deleteRecipe(recipeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${recipeId}`);
  }
}
