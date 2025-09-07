export interface CommentDto {
  id: number;
  recipeId: number;
  username: string;
  content: string;
  createdAt: Date;
}

export interface CreateCommentDto {
  recipeId: number;
  userId: number;
  content: string;
}
