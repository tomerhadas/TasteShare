import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommentService } from '../../../services/comment.service';
import { CommentDto } from '../../../models/comment.model';
import { EventService } from '../../../services/event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    DatePipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './comment-list.html',
  styleUrl: './comment-list.css',
})
export class CommentList implements OnInit, OnDestroy {
  @Input() recipeId!: number;
  comments: CommentDto[] = [];
  loading = true;
  error = false;

  private commentSubscription: Subscription | null = null;

  constructor(
    private commentService: CommentService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadComments();

    this.commentSubscription = this.eventService.commentAdded$.subscribe(
      (newComment) => {
        if (newComment.recipeId === this.recipeId) {
          this.comments = [newComment, ...this.comments];
          newComment.isNew = true;

          setTimeout(() => {
            newComment.isNew = false;
          }, 3000);
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.commentSubscription) {
      this.commentSubscription.unsubscribe();
    }
  }

  loadComments() {
    this.loading = true;
    this.error = false;

    this.commentService.getByRecipe(this.recipeId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading comments', error);
        this.error = true;
        this.loading = false;
      },
    });
  }
}
