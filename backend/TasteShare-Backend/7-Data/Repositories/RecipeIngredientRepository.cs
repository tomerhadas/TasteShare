using Microsoft.EntityFrameworkCore;

namespace TasteShare;

public class RecipeIngredientRepository
{
    private readonly TasteShareDbContext _context;

    public RecipeIngredientRepository(TasteShareDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<RecipeIngredient>> GetByRecipeIdAsync(int recipeId) =>
        await _context.RecipeIngredients
            .Where(i => i.RecipeId == recipeId)
            .ToListAsync();

    public async Task<RecipeIngredient?> GetByIdAsync(int id) =>
        await _context.RecipeIngredients.FirstOrDefaultAsync(i => i.Id == id);

    public async Task AddAsync(RecipeIngredient ingredient)
    {
        _context.RecipeIngredients.Add(ingredient);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(RecipeIngredient ingredient)
    {
        _context.RecipeIngredients.Remove(ingredient);
        await _context.SaveChangesAsync();
    }

}
