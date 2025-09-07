namespace TasteShare;

public class CreateRecipeStepDto
{
    public int RecipeId { get; set; }
    public int Order { get; set; }
    public string Instruction { get; set; } = null!;
    public int? DurationMinutes { get; set; }
}
