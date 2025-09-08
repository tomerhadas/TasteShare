import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { DatePipe } from '@angular/common';
import { CommentService } from '../../../services/comment.service';
import { CommentDto } from '../../../models/comment.model';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    DatePipe,
  ],
  templateUrl: './comment-list.html',
  styleUrl: './comment-list.css',
})
export class CommentList implements OnInit {
  @Input() recipeId!: number;
  comments: CommentDto[] = [];
  loading = true;
  error = false;

  constructor(private commentService: CommentService) {}

  ngOnInit() {
    this.loadComments();
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
