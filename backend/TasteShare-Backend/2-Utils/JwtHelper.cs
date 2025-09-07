using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace TasteShare;

public static class JwtHelper
{
    private static readonly SymmetricSecurityKey _symmetricSecurityKey =
        new SymmetricSecurityKey(Encoding.ASCII.GetBytes(AppConfig.JwtKey));

    private static readonly JwtSecurityTokenHandler _handler = new JwtSecurityTokenHandler();

    public static string GetNewToken(User user)
    {
        var slimUser = new { user.Id, user.Username, user.Email, Role = user.Role.ToString() };

        string json = JsonSerializer.Serialize(slimUser, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        List<Claim> claims = new List<Claim>
        {
            new Claim("user", json),
            new Claim("id", user.Id.ToString()),
            new Claim("username", user.Username),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        SecurityTokenDescriptor descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(AppConfig.JwtKeyExpire),
            NotBefore = DateTime.UtcNow,
            Issuer = "TasteShareAPI",
            Audience = "TasteShareFrontend",
            SigningCredentials = new SigningCredentials(_symmetricSecurityKey, SecurityAlgorithms.HmacSha512)
        };

        SecurityToken securityToken = _handler.CreateToken(descriptor);
        return _handler.WriteToken(securityToken);
    }

    public static void SetBearerOptions(JwtBearerOptions options)
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = "TasteShareAPI",
            ValidAudience = "TasteShareFrontend",
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = _symmetricSecurityKey,
            ClockSkew = TimeSpan.Zero
        };
    }
}
