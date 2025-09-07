namespace TasteShare;

public class CreateRecipeImageDto
{
    public int RecipeId { get; set; }
    public string Url { get; set; } = null!;
    public string? Alt { get; set; }
    public bool IsCover { get; set; }
}
