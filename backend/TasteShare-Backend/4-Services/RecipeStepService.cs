namespace TasteShare;

public class RecipeStepService
{
    private readonly RecipeStepRepository _repository;

    public RecipeStepService(RecipeStepRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<RecipeStepDto>> GetByRecipeIdAsync(int recipeId)
    {
        var steps = await _repository.GetByRecipeIdAsync(recipeId);
        return steps.Select(s => new RecipeStepDto
        {
            Id = s.Id,
            Order = s.Order,
            Instruction = s.Instruction,
            DurationMinutes = s.DurationMinutes
        });
    }

    public async Task<RecipeStepDto> AddAsync(CreateRecipeStepDto dto)
    {
        var step = new RecipeStep
        {
            RecipeId = dto.RecipeId,
            Order = dto.Order,
            Instruction = dto.Instruction,
            DurationMinutes = dto.DurationMinutes
        };

        await _repository.AddAsync(step);

        return new RecipeStepDto
        {
            Id = step.Id,
            Order = step.Order,
            Instruction = step.Instruction,
            DurationMinutes = step.DurationMinutes
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var step = await _repository.GetByIdAsync(id);
        if (step == null) return false;

        await _repository.DeleteAsync(step);
        return true;
    }
}
