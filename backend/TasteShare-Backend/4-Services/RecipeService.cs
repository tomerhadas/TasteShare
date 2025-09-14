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
    public async Task<IEnumerable<RecipeDto>> GetByAuthorIdAsync(int authorId)
    {
        var recipes = await _recipeRepository.GetByAuthorIdAsync(authorId);
        return _mapper.Map<IEnumerable<RecipeDto>>(recipes);
    }
    public async Task<RecipeDto> CreateAsync(CreateRecipeDto dto, int authorId)
    {
        var recipe = _mapper.Map<Recipe>(dto);
        recipe.AuthorId = authorId;
        recipe.CreatedAt = DateTime.UtcNow;

        await _recipeRepository.AddAsync(recipe);
        return _mapper.Map<RecipeDto>(recipe);
    }
    // 4-Services\RecipeService.cs
    public async Task<RecipeDto?> UpdateAsync(int id, CreateRecipeDto dto, int userId)
    {
        var recipe = await _recipeRepository.GetByIdAsync(id);
        if (recipe == null || recipe.AuthorId != userId)
            return null;

        // עדכון השדות הבסיסיים של המתכון
        recipe.Title = dto.Title;
        recipe.Description = dto.Description;
        recipe.Servings = dto.Servings;
        recipe.PrepMinutes = dto.PrepMinutes;
        recipe.CookMinutes = dto.CookMinutes;
        recipe.Difficulty = dto.Difficulty;
        recipe.FoodType = dto.FoodType;
        recipe.IsKosher = dto.IsKosher;
        recipe.UpdatedAt = DateTime.UtcNow;

        // עדכון הרכיבים
        // אפשרות פשוטה: מחיקה והוספה מחדש
        if (dto.Ingredients != null && dto.Ingredients.Any())
        {
            // הסרת כל הרכיבים הקיימים
            recipe.Ingredients.Clear();

            // הוספת הרכיבים החדשים
            foreach (var ingredientDto in dto.Ingredients)
            {
                var ingredient = _mapper.Map<RecipeIngredient>(ingredientDto);
                ingredient.RecipeId = recipe.Id;
                recipe.Ingredients.Add(ingredient);
            }
        }

        // עדכון שלבי ההכנה
        if (dto.Steps != null && dto.Steps.Any())
        {
            // הסרת כל השלבים הקיימים
            recipe.Steps.Clear();

            // הוספת השלבים החדשים
            foreach (var stepDto in dto.Steps)
            {
                var step = _mapper.Map<RecipeStep>(stepDto);
                step.RecipeId = recipe.Id;
                recipe.Steps.Add(step);
            }
        }

        // עדכון תמונות - שומר על תמונות קיימות אם לא נשלחו חדשות
        if (dto.Images != null && dto.Images.Any())
        {
            // הסרת כל התמונות הקיימות
            recipe.Images.Clear();

            // הוספת התמונות החדשות
            foreach (var imageDto in dto.Images)
            {
                var image = _mapper.Map<RecipeImage>(imageDto);
                image.RecipeId = recipe.Id;
                recipe.Images.Add(image);
            }
        }

        // שמירת השינויים
        await _recipeRepository.UpdateAsync(recipe);

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
