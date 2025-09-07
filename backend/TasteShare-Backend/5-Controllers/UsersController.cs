using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TasteShare;

[Route("api/users")]
[ApiController]
public class UserController : ControllerBase, IDisposable
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }

    [HttpGet("{id:int}")]
    [Authorize] // משתמש חייב להיות מחובר
    public async Task<ActionResult<UserDto>> GetById(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return NotFound();
        return Ok(user);
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<UserDto>> Register([FromBody] CreateUserDto dto)
    {
        var user = await _userService.RegisterAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<string>> Login([FromBody] LoginDto dto)
    {
        var token = await _userService.LoginAsync(dto.Email, dto.Password);
        if (token == null)
            return Unauthorized();

        return Ok(token);
    }

    public void Dispose() { }
}
