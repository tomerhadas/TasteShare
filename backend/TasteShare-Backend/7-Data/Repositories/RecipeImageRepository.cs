using Microsoft.EntityFrameworkCore;

namespace TasteShare;

public class RecipeImageRepository
{
    private readonly TasteShareDbContext _context;

    public RecipeImageRepository(TasteShareDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<RecipeImage>> GetByRecipeIdAsync(int recipeId) =>
        await _context.RecipeImages
            .Where(i => i.RecipeId == recipeId)
            .OrderByDescending(i => i.IsCover)
            .ToListAsync();

    public async Task<RecipeImage?> GetByIdAsync(int id) =>
        await _context.RecipeImages.FirstOrDefaultAsync(img => img.Id == id);

    public async Task AddAsync(RecipeImage image)
    {
        _context.RecipeImages.Add(image);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(RecipeImage image)
    {
        _context.RecipeImages.Remove(image);
        await _context.SaveChangesAsync();
    }

    public async Task UnsetCoverImageAsync(int recipeId)
    {
        var coverImages = await _context.RecipeImages
            .Where(i => i.RecipeId == recipeId && i.IsCover)
            .ToListAsync();

        foreach (var image in coverImages)
        {
            image.IsCover = false;
        }

        await _context.SaveChangesAsync();
    }
}
