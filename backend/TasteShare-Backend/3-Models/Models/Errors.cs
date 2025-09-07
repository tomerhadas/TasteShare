namespace TasteShare;

public abstract class BaseError<T>
{
    public T Errors { get; set; }
    protected BaseError(T message)
    {
        Errors = message;
    }
}

public class RouteNotFoundError : BaseError<string>
{
    public RouteNotFoundError(string method, string route) : base($"Route '{route}' on method '{method}' not exists.") { }
}

public class ResourceNotFound : BaseError<string>
{
    public ResourceNotFound(Guid id) : base($"Id '{id}' not found") { }
    public ResourceNotFound(string message) : base(message) { }
}

public class ValidationError<T> : BaseError<T>
{
    public ValidationError(T errors) : base(errors) { }
}

public class UnauthorizedError : BaseError<string>
{
    public UnauthorizedError(string message) : base(message) { }
}

// InternalServerError was moved to 3-Models\Errors\InternalServerError.cs

