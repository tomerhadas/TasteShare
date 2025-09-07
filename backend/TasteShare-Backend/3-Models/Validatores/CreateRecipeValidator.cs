using FluentValidation;

namespace TasteShare;

public class CreateRecipeValidator : AbstractValidator<CreateRecipeDto>
{
    public CreateRecipeValidator()
    {
        RuleFor(r => r.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters.");

        RuleFor(r => r.Description)
            .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters.");

        RuleFor(r => r.Servings)
            .GreaterThan(0).WithMessage("Servings must be greater than 0");

        RuleFor(r => r.PrepMinutes)
            .GreaterThanOrEqualTo(0).WithMessage("PrepMinutes cannot be negative.");

        RuleFor(r => r.CookMinutes)
            .GreaterThanOrEqualTo(0).WithMessage("CookMinutes cannot be negative.");

        // Validate enum values
        RuleFor(r => r.Difficulty)
            .IsInEnum().WithMessage("Invalid difficulty level.");

        RuleFor(r => r.FoodType)
            .IsInEnum().WithMessage("Invalid food type.");

        // Use ChildRules for nested collections
        RuleFor(r => r.Ingredients).ChildRules(ingredients => {
            ingredients.RuleForEach(list => list)
                .SetValidator(new CreateRecipeIngredientValidator());
        });

        RuleFor(r => r.Steps).ChildRules(steps => {
            steps.RuleForEach(list => list)
                .SetValidator(new CreateRecipeStepValidator());
        });

        RuleFor(r => r.Images).ChildRules(images => {
            images.RuleForEach(list => list)
                .SetValidator(new CreateRecipeImageValidator());
        });
    }
}
