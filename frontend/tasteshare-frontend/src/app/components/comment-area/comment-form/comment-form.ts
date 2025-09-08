import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommentService } from '../../../services/comment.service';
import { CreateCommentDto } from '../../../models/comment.model';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './comment-form.html',
  styleUrl: './comment-form.css',
})
export class CommentForm {
  @Input() recipeId!: number;
  commentText = '';
  submitting = false;

  constructor(private commentService: CommentService) {}

  submitComment() {
    if (!this.commentText.trim()) {
      return;
    }

    this.submitting = true;

    // Create comment DTO
    const newComment: CreateCommentDto = {
      recipeId: this.recipeId,
      userId: 1, // Assuming logged in user with ID 1 for now
      content: this.commentText.trim(),
    };

    this.commentService.add(newComment).subscribe({
      next: (result) => {
        console.log('Comment added successfully', result);
        this.commentText = '';
      },
      error: (error) => {
        console.error('Error adding comment', error);
      },
      complete: () => {
        this.submitting = false;
      },
    });
  }
}
