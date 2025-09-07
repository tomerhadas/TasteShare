using FluentValidation;

namespace TasteShare;

public class CreateCommentValidator : AbstractValidator<CreateCommentDto>
{
    public CreateCommentValidator()
    {
        RuleFor(c => c.RecipeId)
            .GreaterThan(0).WithMessage("RecipeId is required.");

        RuleFor(c => c.UserId)
            .GreaterThan(0).WithMessage("UserId is required.");

        RuleFor(c => c.Content)
            .NotEmpty().WithMessage("Content is required.")
            .MaximumLength(500).WithMessage("Content cannot exceed 500 characters.");
    }
}
