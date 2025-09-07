using FluentValidation;

namespace TasteShare;

public class CreateRecipeIngredientValidator : AbstractValidator<CreateRecipeIngredientDto>
{
    public CreateRecipeIngredientValidator()
    {
        RuleFor(i => i.Name)
            .NotEmpty().WithMessage("Ingredient name is required.")
            .MaximumLength(100).WithMessage("Ingredient name cannot exceed 100 characters.");

        RuleFor(i => i.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than 0.");

        RuleFor(i => i.Unit)
            .NotEmpty().WithMessage("Unit is required.");
    }
}
