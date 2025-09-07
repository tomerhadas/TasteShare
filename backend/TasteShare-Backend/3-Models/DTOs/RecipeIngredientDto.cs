namespace TasteShare;

public class RecipeIngredientDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = null!;
    public string? Note { get; set; }
}
