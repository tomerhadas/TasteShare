using System.Xml.Linq;

namespace TasteShare;

public enum UserRole
{
    Member = 0,
    Admin = 1
}

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public UserRole Role { get; set; } = UserRole.Member;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Recipe> Recipes { get; } = new List<Recipe>();
    public ICollection<Comment> Comments { get; } = new List<Comment>();
}
