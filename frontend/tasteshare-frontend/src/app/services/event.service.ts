import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CommentDto } from '../models/comment.model';

/**
 * Service for sharing events between components
 * Used to communicate between comment form and comment list
 */
@Injectable({
  providedIn: 'root',
})
export class EventService {
  // Subject for comment events
  private commentAddedSubject = new Subject<CommentDto>();

  // Observable that components can subscribe to
  commentAdded$ = this.commentAddedSubject.asObservable();

  // Method to emit when a new comment is added
  emitCommentAdded(comment: CommentDto): void {
    this.commentAddedSubject.next(comment);
  }
}
