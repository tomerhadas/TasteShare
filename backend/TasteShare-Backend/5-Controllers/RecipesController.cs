using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TasteShare;

[Route("api/recipes")]
[ApiController]
public class RecipeController : ControllerBase, IDisposable
{
    private readonly RecipeService _recipeService;

    public RecipeController(RecipeService recipeService)
    {
        _recipeService = recipeService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<RecipeDto>>> GetAll()
    {
        var recipes = await _recipeService.GetAllAsync();
        return Ok(recipes);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<RecipeDto>> GetById(int id)
    {
        var recipe = await _recipeService.GetByIdAsync(id);
        if (recipe == null)
            return NotFound();

        return Ok(recipe);
    }
    [HttpGet("my-recipes")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<RecipeDto>>> GetMyRecipes()
    {
        var userId = int.Parse(User.FindFirst("id")!.Value);
        var recipes = await _recipeService.GetByAuthorIdAsync(userId);
        return Ok(recipes);
    }
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<RecipeDto>> Create([FromBody] CreateRecipeDto dto)
    {
        var userId = int.Parse(User.FindFirst("id")!.Value);
        var recipe = await _recipeService.CreateAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = recipe.Id }, recipe);
    }
    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<ActionResult<RecipeDto>> Update(int id, [FromBody] CreateRecipeDto dto)
    {
        var userId = int.Parse(User.FindFirst("id")!.Value);
        var updatedRecipe = await _recipeService.UpdateAsync(id, dto, userId);

        if (updatedRecipe == null)
            return Forbid(); // המשתמש אינו בעל המתכון או שהמתכון לא נמצא

        return Ok(updatedRecipe);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Member")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = int.Parse(User.FindFirst("id")!.Value);
        var isAdmin = User.IsInRole("Admin");

        var deleted = await _recipeService.DeleteAsync(id, userId, isAdmin);
        if (!deleted)
            return Forbid();

        return NoContent();
    }

    public void Dispose() { }
}
