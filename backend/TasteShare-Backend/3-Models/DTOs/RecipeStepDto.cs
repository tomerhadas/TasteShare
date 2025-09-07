namespace TasteShare;

public class RecipeStepDto
{
    public int Id { get; set; }
    public int Order { get; set; }
    public string Instruction { get; set; } = null!;
    public int? DurationMinutes { get; set; }
}
