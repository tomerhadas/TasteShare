using AutoMapper;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace TasteShare;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // load config
        AppConfig.Configure(builder.Environment);

        // Controllers
        builder.Services.AddControllers();

        // DbContext
        builder.Services.AddDbContext<TasteShareDbContext>(options =>
            options.UseSqlServer(AppConfig.ConnectionString));

        // AutoMapper
        builder.Services.AddAutoMapper(cfg =>
        {
            cfg.AddProfile<MappingProfile>();
        });

        // FluentValidation
        builder.Services.AddFluentValidationAutoValidation();

        // JWT Auth
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(JwtHelper.SetBearerOptions);

        builder.Services.AddAuthorization();

        // CORS
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", policy =>
            {
                policy.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader();
            });
        });

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
        builder.Services.AddScoped<RecipeImageService>();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseCors("AllowAll");
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        app.Run();

    }
}