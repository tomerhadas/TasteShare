import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentDto, CreateCommentDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly apiUrl = 'https://localhost:7261/api/comments';

  constructor(private http: HttpClient) {}

  getByRecipe(recipeId: number): Observable<CommentDto[]> {
    // Ensure recipeId is a valid number and convert it to string properly
    const id = Number(recipeId);
    if (isNaN(id)) {
      console.error('Invalid recipe ID:', recipeId);
      return new Observable((subscriber) => {
        subscriber.error('Invalid recipe ID');
        subscriber.complete();
      });
    }
    return this.http.get<CommentDto[]>(`${this.apiUrl}/recipe/${id}`);
  }

  add(dto: CreateCommentDto): Observable<CommentDto> {
    console.log('CommentService - Adding comment with data:', dto);
    return this.http.post<CommentDto>(this.apiUrl, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
