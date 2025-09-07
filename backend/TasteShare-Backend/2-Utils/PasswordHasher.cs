using System.Security.Cryptography;
using System.Text;

namespace TasteShare;

public static class PasswordHasher
{
    public static string HashPassword(string plainText)
    {
        string salt = "TasteShare#Salt!2025"; // Salt קבוע לפרויקט

        byte[] saltBytes = Encoding.UTF8.GetBytes(salt);

        Rfc2898DeriveBytes rfc = new Rfc2898DeriveBytes(
            plainText,
            saltBytes,
            18,
            HashAlgorithmName.SHA512);

        byte[] hashBytes = rfc.GetBytes(64);
        string hashPassword = Convert.ToBase64String(hashBytes);

        return hashPassword;
    }
}
