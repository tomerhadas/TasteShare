using Microsoft.EntityFrameworkCore;

namespace TasteShare;

public class RecipeRepository
{
    private readonly TasteShareDbContext _context;

    public RecipeRepository(TasteShareDbContext context)
    {
        _context = context;
    }

    public async Task<List<Recipe>> GetAllAsync()
    {
        return await _context.Recipes
            .Include(r => r.Author)
            .Include(r => r.Ingredients)
            .Include(r => r.Steps)
            .Include(r => r.Images)
            .Include(r => r.Comments)
            .ToListAsync();
    }

    public async Task<Recipe?> GetByIdAsync(int id)
    {
        return await _context.Recipes
            .Include(r => r.Author)
            .Include(r => r.Ingredients)
            .Include(r => r.Steps)
            .Include(r => r.Images)
            .Include(r => r.Comments)
            .FirstOrDefaultAsync(r => r.Id == id);
    }
    public async Task<List<Recipe>> GetByAuthorIdAsync(int authorId)
    {
        return await _context.Recipes
            .Include(r => r.Author)
            .Include(r => r.Ingredients)
            .Include(r => r.Steps)
            .Include(r => r.Images)
            .Include(r => r.Comments)
            .Where(r => r.AuthorId == authorId)
            .ToListAsync();
    }
    public async Task AddAsync(Recipe recipe)
    {
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Recipe recipe)
    {
        _context.Recipes.Remove(recipe);
        await _context.SaveChangesAsync();
    }
}
