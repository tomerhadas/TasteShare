using AutoMapper;

namespace TasteShare;

public class RecipeService
{
    private readonly RecipeRepository _recipeRepository;
    private readonly IMapper _mapper;

    public RecipeService(RecipeRepository recipeRepository, IMapper mapper)
    {
        _recipeRepository = recipeRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<RecipeDto>> GetAllAsync()
    {
        var recipes = await _recipeRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<RecipeDto>>(recipes);
    }

    public async Task<RecipeDto?> GetByIdAsync(int id)
    {
        var recipe = await _recipeRepository.GetByIdAsync(id);
        return recipe == null ? null : _mapper.Map<RecipeDto>(recipe);
    }

    public async Task<RecipeDto> CreateAsync(CreateRecipeDto dto, int authorId)
    {
        var recipe = _mapper.Map<Recipe>(dto);
        recipe.AuthorId = authorId;
        recipe.CreatedAt = DateTime.UtcNow;

        await _recipeRepository.AddAsync(recipe);
        return _mapper.Map<RecipeDto>(recipe);
    }

    public async Task<bool> DeleteAsync(int id, int currentUserId, bool isAdmin)
    {
        var recipe = await _recipeRepository.GetByIdAsync(id);
        if (recipe == null) return false;

        if (!isAdmin && recipe.AuthorId != currentUserId)
            return false;

        await _recipeRepository.DeleteAsync(recipe);
        return true;
    }
}
