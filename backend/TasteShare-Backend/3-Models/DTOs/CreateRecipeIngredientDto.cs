namespace TasteShare;

public class CreateRecipeIngredientDto
{
    public int RecipeId { get; set; }
    public string Name { get; set; } = null!;
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = null!;
    public string? Note { get; set; }
}
