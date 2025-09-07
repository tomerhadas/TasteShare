public class CreateCommentDto
{
    public int RecipeId { get; set; }
    public int UserId { get; set; }
    public string Content { get; set; } = null!;
}
