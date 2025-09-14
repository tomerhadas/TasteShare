import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { CommentService } from '../../../services/comment.service';
import { AuthService } from '../../../services/auth.service';
import { EnvironmentService } from '../../../services/environment.service';
import { EventService } from '../../../services/event.service';
import { CreateCommentDto, CommentDto } from '../../../models/comment.model';
import { UserDto } from '../../../models/user.model';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './comment-form.html',
  styleUrl: './comment-form.css',
})
export class CommentForm implements OnInit {
  @Input() recipeId!: number;
  commentText = '';
  submitting = false;
  isAuthenticated = false;
  user: UserDto | null = null;

  constructor(
    private commentService: CommentService,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private env: EnvironmentService,
    private eventService: EventService
  ) {
    this.env.devLog('Comment form initialized');
  }

  ngOnInit() {
    this.checkAuthStatus();
    this.authService.currentUser$.subscribe(() => {
      this.checkAuthStatus();
    });
  }

  checkAuthStatus() {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.user = this.authService.getCurrentUser();

    if (this.isAuthenticated && !this.user) {
      setTimeout(() => {
        this.user = this.authService.getCurrentUser();
      }, 100);
    }
    return this.isAuthenticated;
  }

  submitComment() {
    if (!this.commentText.trim()) return;

    this.isAuthenticated = this.authService.isLoggedIn();
    this.user = this.authService.getCurrentUser();

    if (!this.isAuthenticated || !this.user) {
      this.snackBar.open('Please log in to add a comment', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.submitting = true;

    const newComment: CreateCommentDto = {
      recipeId: this.recipeId,
      content: this.commentText.trim(),
    };

    this.commentService.add(newComment).subscribe({
      next: (result: CommentDto) => {
        this.commentText = '';
        this.snackBar.open('Comment posted successfully!', 'Close', {
          duration: 3000,
        });
        this.eventService.emitCommentAdded(result);
      },
      error: () => {
        this.env.errorLog('Error adding comment');
        this.snackBar.open('An error occurred while adding the comment.', 'Close', {
          duration: 5000,
        });
      },
      complete: () => {
        this.submitting = false;
      },
    });
  }
}
