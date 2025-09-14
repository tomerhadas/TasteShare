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
        // Controllers with JSON enum string support
        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
            });
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
        // Swagger
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
            {
                Title = "TasteShare-Backend",
                Version = "v1"
            });

            // 🔑 הגדרת Bearer token
            c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Description = "Enter JWT token: Bearer {your token}",
                Name = "Authorization",
                In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT"
            });

            c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
        });
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