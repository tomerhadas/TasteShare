namespace TasteShare;

public class CommentDto
{
    public int Id { get; set; }
    public int RecipeId { get; set; }
    public int UserId { get; set; }   // מזהה המשתמש
    public string Username { get; set; } = null!; // שם המשתמש
    public string Content { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}
