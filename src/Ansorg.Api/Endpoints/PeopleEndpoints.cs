namespace Ansorg.Api.Endpoints;

public sealed record CreatePersonRequest(string Name);

public static class PeopleEndpoints
{
    private static readonly List<string> Handler = ["Alice", "Bob"];

    public static IEndpointRouteBuilder MapAnsorgApiEndpoints(this IEndpointRouteBuilder app)
    {
        // Anonymous endpoints
        app.MapGet("/", () => Results.Ok(new { Name = "ansorg-api", Status = "ok" }));
        app.MapGet("/health", () => Results.Ok("healthy"));

        // Protected endpoints
        app.MapGet("/people", () => Handler)
            .RequireAuthorization("CanRead");

        app.MapPost("/people", (CreatePersonRequest req) =>
            {
                if (string.IsNullOrWhiteSpace(req.Name))
                    return Results.BadRequest(new { error = "Name is required" });

                Handler.Add(req.Name);
                return Results.Created($"/people/{Handler.Count - 1}", new { Created = req.Name });
            })
            .RequireAuthorization("CanWrite");

        app.MapDelete("/people/{name}", (string name) =>
        {
            Handler.Remove(name);
            return Results.Ok();
        }).RequireAuthorization("IsAdmin");

        return app;
    }
}