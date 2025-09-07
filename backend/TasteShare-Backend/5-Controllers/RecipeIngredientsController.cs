using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TasteShare;

[Route("api/recipes/{recipeId}/ingredients")]
[ApiController]
public class RecipeIngredientsController : ControllerBase, IDisposable
{
    private readonly RecipeIngredientService _ingredientService;

    public RecipeIngredientsController(RecipeIngredientService ingredientService)
    {
        _ingredientService = ingredientService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<RecipeIngredientDto>>> GetByRecipeId(int recipeId)
    {
        var ingredients = await _ingredientService.GetByRecipeIdAsync(recipeId);
        return Ok(ingredients);
    }

    [HttpPost]
    [Authorize(Roles = "Member,Admin")]
    public async Task<ActionResult<RecipeIngredientDto>> Add(int recipeId, [FromBody] CreateRecipeIngredientDto dto)
    {
        var userId = int.Parse(User.FindFirst("id")!.Value);
        dto.RecipeId = recipeId; // Set the RecipeId on the DTO
        
        var ingredient = await _ingredientService.AddAsync(dto);
        return Ok(ingredient);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Member,Admin")]
    public async Task<IActionResult> Delete(int recipeId, int id)
    {
        var userId = int.Parse(User.FindFirst("id")!.Value);
        var isAdmin = User.IsInRole("Admin");
        
        var deleted = await _ingredientService.DeleteAsync(id);
        return deleted ? NoContent() : Forbid();
    }

    public void Dispose() { }
}