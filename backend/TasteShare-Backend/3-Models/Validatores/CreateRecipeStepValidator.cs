using FluentValidation;

namespace TasteShare;

public class CreateRecipeStepValidator : AbstractValidator<CreateRecipeStepDto>
{
    public CreateRecipeStepValidator()
    {
        RuleFor(s => s.Order)
            .GreaterThan(0).WithMessage("Step order must be greater than 0.");

        RuleFor(s => s.Instruction)
            .NotEmpty().WithMessage("Instruction is required.")
            .MaximumLength(500).WithMessage("Instruction cannot exceed 500 characters.");
    }
}
