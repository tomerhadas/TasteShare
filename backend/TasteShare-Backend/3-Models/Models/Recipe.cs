namespace TasteShare;

public enum Difficulty
{
    Easy,
    Medium,
    Hard
}

public enum FoodType
{
    Meat,
    Dairy,
    Parve
}

public class Recipe
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
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public int ViewCount { get; set; } = 0;
    public double AvgRating { get; set; } = 0;

    public int AuthorId { get; set; }
    public User Author { get; set; } = null!;

    public ICollection<RecipeIngredient> Ingredients { get; } = new List<RecipeIngredient>();
    public ICollection<RecipeStep> Steps { get; } = new List<RecipeStep>();
    public ICollection<RecipeImage> Images { get; } = new List<RecipeImage>();
    public ICollection<Comment> Comments { get; } = new List<Comment>();
}
