using Microsoft.EntityFrameworkCore;

namespace TasteShare;

public class CommentRepository
{
    private readonly TasteShareDbContext _context;

    public CommentRepository(TasteShareDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Comment>> GetByRecipeIdAsync(int recipeId) =>
        await _context.Comments
            .Include(c => c.User)   // חשוב כדי שנוכל למפות ל-Username
            .Where(c => c.RecipeId == recipeId)
            .ToListAsync();

    public async Task<Comment?> GetByIdAsync(int id) =>
        await _context.Comments
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == id);

    public async Task AddAsync(Comment comment)
    {
        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Comment comment)
    {
        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();
    }
}
