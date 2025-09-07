using FluentValidation;

namespace TasteShare;

public class CreateRecipeImageValidator : AbstractValidator<CreateRecipeImageDto>
{
    public CreateRecipeImageValidator()
    {
        RuleFor(i => i.Url)
            .NotEmpty().WithMessage("Image URL is required.")
            .MaximumLength(500).WithMessage("Image URL cannot exceed 500 characters.");

        RuleFor(i => i.Alt)
            .MaximumLength(150).WithMessage("Alt text cannot exceed 150 characters.");
    }
}
