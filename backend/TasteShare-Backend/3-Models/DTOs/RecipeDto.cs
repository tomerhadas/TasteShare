namespace TasteShare;

public class RecipeDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public int Servings { get; set; }
    public int PrepMinutes { get; set; }
    public int CookMinutes { get; set; }
    public Difficulty Difficulty { get; set; }
    public FoodType FoodType { get; set; }
    public bool IsKosher { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int ViewCount { get; set; }
    public double AvgRating { get; set; }
    public string AuthorName { get; set; } = null!;

    public List<RecipeIngredientDto> Ingredients { get; set; } = new();
    public List<RecipeStepDto> Steps { get; set; } = new();
    public List<RecipeImageDto> Images { get; set; } = new();
    public List<CommentDto> Comments { get; set; } = new();
}
