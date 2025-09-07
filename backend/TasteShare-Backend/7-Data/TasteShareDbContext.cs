using Microsoft.EntityFrameworkCore;

namespace TasteShare;

public class TasteShareDbContext : DbContext
{
    public TasteShareDbContext(DbContextOptions<TasteShareDbContext> options)
        : base(options) { }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Recipe> Recipes { get; set; } = null!;
    public DbSet<RecipeIngredient> RecipeIngredients { get; set; } = null!;
    public DbSet<RecipeStep> RecipeSteps { get; set; } = null!;
    public DbSet<RecipeImage> RecipeImages { get; set; } = null!;
    public DbSet<Comment> Comments { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // קשר: Recipe → Author (User)
        modelBuilder.Entity<Recipe>()
            .HasOne(r => r.Author)
            .WithMany(u => u.Recipes)
            .HasForeignKey(r => r.AuthorId)
            .OnDelete(DeleteBehavior.Cascade);

        // קשר: Comment → Recipe
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Recipe)
            .WithMany(r => r.Comments)
            .HasForeignKey(c => c.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);

        // קשר: Comment → User
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.User)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Username = "admin",
                Email = "admin@tasteshare.com",
                PasswordHash = "admin123",
                Role = UserRole.Admin,
                CreatedAt = new DateTime(2025, 09, 02)
            },
            new User
            {
                Id = 2,
                Username = "john_doe",
                Email = "john@example.com",
                PasswordHash = "123456",
                Role = UserRole.Member,
                CreatedAt = new DateTime(2025, 09, 02)
            }
        );


        // מתכון דוגמה
        modelBuilder.Entity<Recipe>().HasData(
            new Recipe
            {
                Id = 1,
                Title = "עוגת גבינה אפויה",
                Description = "מתכון פשוט לעוגת גבינה אפויה ביתית.",
                Servings = 8,
                PrepMinutes = 20,
                CookMinutes = 60,
                Difficulty = Difficulty.Medium,
                FoodType = FoodType.Dairy,
                IsKosher = true,
                CreatedAt = new DateTime(2025, 09, 02), // 👈 לא דינאמי
                AuthorId = 2,
                ViewCount = 0,
                AvgRating = 0
            }
        );


        // מרכיבים לדוגמה
        modelBuilder.Entity<RecipeIngredient>().HasData(
            new RecipeIngredient { Id = 1, RecipeId = 1, Name = "גבינה לבנה", Quantity = 500, Unit = "גרם" },
            new RecipeIngredient { Id = 2, RecipeId = 1, Name = "סוכר", Quantity = 200, Unit = "גרם" },
            new RecipeIngredient { Id = 3, RecipeId = 1, Name = "ביצים", Quantity = 4, Unit = "יח'" }
        );

        // שלבי הכנה לדוגמה
        modelBuilder.Entity<RecipeStep>().HasData(
            new RecipeStep { Id = 1, RecipeId = 1, Order = 1, Instruction = "מערבבים את כל החומרים בקערה." },
            new RecipeStep { Id = 2, RecipeId = 1, Order = 2, Instruction = "יוצקים לתבנית ואופים 60 דקות ב־180 מעלות." }
        );

        // תמונה לדוגמה
        modelBuilder.Entity<RecipeImage>().HasData(
            new RecipeImage { Id = 1, RecipeId = 1, Url = "https://example.com/cheesecake.jpg", Alt = "עוגת גבינה אפויה", IsCover = true }
        );
    }
}
