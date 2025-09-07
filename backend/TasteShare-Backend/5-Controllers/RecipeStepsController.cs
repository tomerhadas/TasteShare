using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TasteShare;

[Route("api/recipes/{recipeId}/steps")]
[ApiController]
public class RecipeStepsController : ControllerBase, IDisposable
{
    private readonly RecipeStepService _stepService;

    public RecipeStepsController(RecipeStepService stepService)
    {
        _stepService = stepService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<RecipeStepDto>>> GetByRecipeId(int recipeId)
    {
        var steps = await _stepService.GetByRecipeIdAsync(recipeId);
        return Ok(steps);
    }

    [HttpPost]
    [Authorize(Roles = "Member,Admin")]
    public async Task<ActionResult<RecipeStepDto>> Add(int recipeId, [FromBody] CreateRecipeStepDto dto)
    {
        var userId = int.Parse(User.FindFirst("id")!.Value);
        dto.RecipeId = recipeId; // Set the RecipeId on the DTO
        
        var step = await _stepService.AddAsync(dto);
        return Ok(step);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Member,Admin")]
    public async Task<IActionResult> Delete(int recipeId, int id)
    {
        var userId = int.Parse(User.FindFirst("id")!.Value);
        var isAdmin = User.IsInRole("Admin");
        
        var deleted = await _stepService.DeleteAsync(id);
        return deleted ? NoContent() : Forbid();
    }

    public void Dispose() { }
}