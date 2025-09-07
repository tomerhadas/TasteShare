namespace TasteShare;

public class RecipeIngredientService
{
    private readonly RecipeIngredientRepository _repository;

    public RecipeIngredientService(RecipeIngredientRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<RecipeIngredientDto>> GetByRecipeIdAsync(int recipeId)
    {
        var ingredients = await _repository.GetByRecipeIdAsync(recipeId);
        return ingredients.Select(i => new RecipeIngredientDto
        {
            Id = i.Id,
            Name = i.Name,
            Quantity = i.Quantity,
            Unit = i.Unit,
            Note = i.Note
        });
    }

    public async Task<RecipeIngredientDto> AddAsync(CreateRecipeIngredientDto dto)
    {
        var ingredient = new RecipeIngredient
        {
            RecipeId = dto.RecipeId,
            Name = dto.Name,
            Quantity = dto.Quantity,
            Unit = dto.Unit,
            Note = dto.Note
        };

        await _repository.AddAsync(ingredient);

        return new RecipeIngredientDto
        {
            Id = ingredient.Id,
            Name = ingredient.Name,
            Quantity = ingredient.Quantity,
            Unit = ingredient.Unit,
            Note = ingredient.Note
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var ingredient = await _repository.GetByIdAsync(id);
        if (ingredient == null) return false;

        await _repository.DeleteAsync(ingredient);
        return true;
    }
}
