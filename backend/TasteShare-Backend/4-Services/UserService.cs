using AutoMapper;

namespace TasteShare;

public class UserService
{
    private readonly UserRepository _userRepository;
    private readonly IMapper _mapper;

    public UserService(UserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        return user == null ? null : _mapper.Map<UserDto>(user);
    }

    public async Task<IEnumerable<UserDto>> GetAllAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<UserDto>>(users);
    }

    public async Task<UserDto> RegisterAsync(CreateUserDto dto)
    {
        var user = _mapper.Map<User>(dto);
        user.PasswordHash = PasswordHasher.HashPassword(dto.Password);
        user.CreatedAt = DateTime.UtcNow;

        await _userRepository.AddAsync(user);
        return _mapper.Map<UserDto>(user);
    }

    public async Task<string?> LoginAsync(string email, string password)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        if (user == null) return null;

        var hashed = PasswordHasher.HashPassword(password);
        if (user.PasswordHash != hashed) return null;

        return JwtHelper.GetNewToken(user);
    }
}
