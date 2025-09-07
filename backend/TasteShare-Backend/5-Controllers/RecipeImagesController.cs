using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TasteShare;

[Route("api/recipes/{recipeId}/images")]
[ApiController]
public class RecipeImagesController : ControllerBase, IDisposable
{
    private readonly RecipeImageService _imageService;

    public RecipeImagesController(RecipeImageService imageService)
    {
        _imageService = imageService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<RecipeImageDto>>> GetByRecipeId(int recipeId)
    {
        var images = await _imageService.GetByRecipeIdAsync(recipeId);
        return Ok(images);
    }

    [HttpPost]
    [Authorize(Roles = "Member,Admin")]
    public async Task<ActionResult<RecipeImageDto>> Add(int recipeId, [FromBody] CreateRecipeImageDto dto)
    {
        var userId = int.Parse(User.FindFirst("id")!.Value);
        dto.RecipeId = recipeId; // Set the RecipeId on the DTO
        
        var image = await _imageService.AddAsync(dto);
        return Ok(image);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Member,Admin")]
    public async Task<IActionResult> Delete(int recipeId, int id)
    {
        var userId = int.Parse(User.FindFirst("id")!.Value);
        var isAdmin = User.IsInRole("Admin");
        
        var deleted = await _imageService.DeleteAsync(id);
        return deleted ? NoContent() : Forbid();
    }

    public void Dispose() { }
}