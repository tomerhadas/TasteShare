namespace TasteShare;

public class RecipeImageDto
{
    public int Id { get; set; }
    public string Url { get; set; } = null!;
    public string? Alt { get; set; }
    public bool IsCover { get; set; }
}
