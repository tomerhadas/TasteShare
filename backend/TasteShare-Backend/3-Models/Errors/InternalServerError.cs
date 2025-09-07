namespace TasteShare;

public class InternalServerError
{
    public string Message { get; set; }
    public int StatusCode { get; set; } = 500;
    public string ErrorType { get; set; } = "Server Error";

    public InternalServerError(string message)
    {
        Message = message;
    }
}