namespace TasteShare;

public class RecipeImage
{
    public int Id { get; set; }
    public int RecipeId { get; set; }

    public Recipe Recipe { get; set; } = null!;

    public string Url { get; set; } = null!;
    public string? Alt { get; set; }
    public bool IsCover { get; set; } = false;
}
