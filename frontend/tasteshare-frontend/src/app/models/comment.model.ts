export interface CommentDto {
  id: number;
  recipeId: number;
  username: string;
  content: string;
  createdAt: Date;
  isNew?: boolean; // UI state for animations
}

export interface CreateCommentDto {
  recipeId: number;
  content: string;
  // userId is not needed as the backend extracts it from the JWT token
}
