using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TasteShare;

[Route("api/comments")]
[ApiController]
public class CommentsController : ControllerBase, IDisposable
{
    private readonly CommentService _commentService;

    public CommentsController(CommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Member")]
    public async Task<ActionResult<CommentDto>> Add([FromBody] CreateCommentDto dto)
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        dto.UserId = userId; // Set the UserId on the DTO
        var comment = await _commentService.AddAsync(dto); // Call the correct overload
        return Ok(comment);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Member")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        var isAdmin = User.IsInRole("Admin");
        var deleted = await _commentService.DeleteAsync(id, userId, isAdmin);

        return deleted ? NoContent() : Forbid();
    }

    public void Dispose() { }
}
