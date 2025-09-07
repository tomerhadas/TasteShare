using Microsoft.EntityFrameworkCore;

namespace TasteShare;

public class RecipeStepRepository
{
    private readonly TasteShareDbContext _context;

    public RecipeStepRepository(TasteShareDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<RecipeStep>> GetByRecipeIdAsync(int recipeId) =>
        await _context.RecipeSteps
            .Where(s => s.RecipeId == recipeId)
            .OrderBy(s => s.Order)
            .ToListAsync();

    public async Task<RecipeStep?> GetByIdAsync(int id) =>
        await _context.RecipeSteps.FirstOrDefaultAsync(s => s.Id == id);

    public async Task AddAsync(RecipeStep step)
    {
        _context.RecipeSteps.Add(step);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(RecipeStep step)
    {
        _context.RecipeSteps.Remove(step);
        await _context.SaveChangesAsync();
    }
}
