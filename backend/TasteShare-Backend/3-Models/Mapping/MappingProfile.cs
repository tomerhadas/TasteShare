using AutoMapper;

namespace TasteShare;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Users
        CreateMap<User, UserDto>();
        CreateMap<CreateUserDto, User>();

        // Recipes
        CreateMap<Recipe, RecipeDto>()
            .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.Author.Username));
        CreateMap<CreateRecipeDto, Recipe>();

        // Ingredients
        CreateMap<RecipeIngredient, RecipeIngredientDto>();
        CreateMap<CreateRecipeIngredientDto, RecipeIngredient>();

        // Steps
        CreateMap<RecipeStep, RecipeStepDto>();
        CreateMap<CreateRecipeStepDto, RecipeStep>();

        // Images
        CreateMap<RecipeImage, RecipeImageDto>();
        CreateMap<CreateRecipeImageDto, RecipeImage>();

        // Comments
        CreateMap<Comment, CommentDto>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username));
        CreateMap<CreateCommentDto, Comment>();
    }
}
