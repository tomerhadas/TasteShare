using AutoMapper;

namespace TasteShare;

public class RecipeImageService
{
    private readonly RecipeImageRepository _repository;

    public RecipeImageService(RecipeImageRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<RecipeImageDto>> GetByRecipeIdAsync(int recipeId)
    {
        var images = await _repository.GetByRecipeIdAsync(recipeId);
        return images.Select(i => new RecipeImageDto
        {
            Id = i.Id,
            Url = i.Url,
            Alt = i.Alt,
            IsCover = i.IsCover
        });
    }

    public async Task<RecipeImageDto> AddAsync(CreateRecipeImageDto dto)
    {
        var image = new RecipeImage
        {
            RecipeId = dto.RecipeId,
            Url = dto.Url,
            Alt = dto.Alt,
            IsCover = dto.IsCover
        };

        // If this is marked as cover image, unset any existing cover images
        if (image.IsCover)
        {
            await _repository.UnsetCoverImageAsync(dto.RecipeId);
        }

        await _repository.AddAsync(image);

        return new RecipeImageDto
        {
            Id = image.Id,
            Url = image.Url,
            Alt = image.Alt,
            IsCover = image.IsCover
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var image = await _repository.GetByIdAsync(id);
        if (image == null) return false;

        await _repository.DeleteAsync(image);
        return true;
    }
}