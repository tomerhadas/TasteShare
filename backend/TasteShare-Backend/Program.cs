using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace TasteShare;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // קונפיגורציה כללית
        AppConfig.Configure(builder.Environment);

        // Add services to the container.
        builder.Services.AddControllers();

        //  Validators
        builder.Services.AddFluentValidationAutoValidation()
                        .AddValidatorsFromAssemblyContaining<CreateUserValidator>();

        // JWT Authentication
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(JwtHelper.SetBearerOptions);

        builder.Services.AddAuthorization();

        // Swagger
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        // Repositories
        builder.Services.AddScoped<UserRepository>();
        builder.Services.AddScoped<RecipeRepository>();
        builder.Services.AddScoped<CommentRepository>();
        builder.Services.AddScoped<RecipeIngredientRepository>();
        builder.Services.AddScoped<RecipeStepRepository>();
        builder.Services.AddScoped<RecipeImageRepository>();

        // Services
        builder.Services.AddScoped<UserService>();
        builder.Services.AddScoped<RecipeService>();
        builder.Services.AddScoped<CommentService>();
        builder.Services.AddScoped<RecipeIngredientService>();
        builder.Services.AddScoped<RecipeStepService>();
        builder.Services.AddScoped<RecipeImageService>();  // Uncomment this line
        //builder.Services.AddScoped<RecipeImageService>();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        //  Authentication,Authorization
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        // Add services to the container.
        builder.Services.AddControllers(options =>
        {
            // Register the global exception filter
            options.Filters.Add<CatchAllFilter>();
        });
        app.Run();
    }
}
