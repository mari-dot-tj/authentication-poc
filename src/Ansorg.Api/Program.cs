using Ansorg.Api.Endpoints;
using Ansorg.Api.Auth;

var builder = WebApplication.CreateBuilder(args);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSPA", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite's default dev port
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddAnsorgAuthentication(builder.Configuration);

var app = builder.Build();

app.UseCors("AllowSPA");
app.MapAnsorgApiEndpoints();

app.UseAuthentication();
app.UseAuthorization();
app.Run();
