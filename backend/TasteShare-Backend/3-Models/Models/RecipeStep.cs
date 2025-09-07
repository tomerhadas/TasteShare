namespace TasteShare;

public class RecipeStep
{
    public int Id { get; set; }
    public int RecipeId { get; set; }
    public Recipe Recipe { get; set; } = null!;
    public int Order { get; set; }
    public string Instruction { get; set; } = null!;
    public int? DurationMinutes { get; set; }
}
