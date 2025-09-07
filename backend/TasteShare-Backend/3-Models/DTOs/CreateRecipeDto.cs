namespace TasteShare;

public class CreateRecipeDto
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public int Servings { get; set; }
    public int PrepMinutes { get; set; }
    public int CookMinutes { get; set; }
    public Difficulty Difficulty { get; set; }
    public FoodType FoodType { get; set; }
    public bool IsKosher { get; set; }
    public List<CreateRecipeIngredientDto> Ingredients { get; set; } = new();
    public List<CreateRecipeStepDto> Steps { get; set; } = new();
    public List<CreateRecipeImageDto> Images { get; set; } = new();
}
