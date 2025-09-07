import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentDto, CreateCommentDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly apiUrl = 'https://localhost:7261/api/comments';

  constructor(private http: HttpClient) {}

  getByRecipe(recipeId: number): Observable<CommentDto[]> {
    return this.http.get<CommentDto[]>(`${this.apiUrl}/recipe/${recipeId}`);
  }

  add(dto: CreateCommentDto): Observable<CommentDto> {
    return this.http.post<CommentDto>(this.apiUrl, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
