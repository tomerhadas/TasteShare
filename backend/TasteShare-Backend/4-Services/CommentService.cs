using AutoMapper;

namespace TasteShare;

public class CommentService
{
    private readonly CommentRepository _commentRepository;
    private readonly IMapper _mapper;

    public CommentService(CommentRepository commentRepository, IMapper mapper)
    {
        _commentRepository = commentRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CommentDto>> GetByRecipeIdAsync(int recipeId)
    {
        var comments = await _commentRepository.GetByRecipeIdAsync(recipeId);
        return _mapper.Map<IEnumerable<CommentDto>>(comments);
    }

    public async Task<CommentDto> AddAsync(CreateCommentDto dto)
    {
        var comment = _mapper.Map<Comment>(dto);
        comment.CreatedAt = DateTime.UtcNow;

        await _commentRepository.AddAsync(comment);
        return _mapper.Map<CommentDto>(comment);
    }

    public async Task<bool> DeleteAsync(int id, int currentUserId, bool isAdmin)
    {
        var comment = await _commentRepository.GetByIdAsync(id);
        if (comment == null) return false;

        if (!isAdmin && comment.UserId != currentUserId)
            return false;

        await _commentRepository.DeleteAsync(comment);
        return true;
    }
}
