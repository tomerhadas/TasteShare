namespace TasteShare;

public static class AppConfig
{
    public static bool IsProduction;
    public static string ConnectionString { get; private set; } = null!;
    public static string JwtKey { get; private set; } = "TasteShareSuperSecretKey!123456789";
    public static int JwtKeyExpire { get; private set; } = 24; // default = 24h

    public static void Configure(IWebHostEnvironment env)
    {
        IsProduction = env.IsProduction();

        IConfigurationRoot settings = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
            .Build();

        ConnectionString = settings.GetConnectionString("TasteShare")!;
        JwtKeyExpire = env.IsDevelopment() ? 24 : 8; // 24h in dev, 8h in prod
    }
}
