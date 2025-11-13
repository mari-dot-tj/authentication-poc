# Ansorg API

A multi-tenant protected API using Microsoft Entra ID (formerly Azure AD) for authentication and authorization. Built with .NET 9 minimal APIs, demonstrating production-ready patterns for building secure, multi-tenant services.

## Prerequisites

- .NET 9 SDK
- Microsoft Entra ID tenant
- Azure AD app registration for the API

## Getting Started

### 1. Configure Azure AD App Registration

Create an app registration in Microsoft Entra ID for your API:

1. Navigate to Azure Portal → Entra ID → App registrations
2. Create a new registration for the API
3. Configure **Expose an API**:
   - Add an Application ID URI (e.g., `api://your-api-app-id`)
   - Add scopes: `Ansorg.Read`, `Ansorg.Write`
4. Configure **App roles**:
   - Add roles: `Ansorg.Reader`, `Ansorg.Writer`, `Ansorg.Admin`
5. Note the **Application (client) ID** and **Directory (tenant) ID**

### 2. Configure Application Settings

Update `src/Ansorg.Api/appsettings.Development.json`:

```json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "TenantId": "your-tenant-id",
    "Audience": "your-api-app-id"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

**Required Configuration:**
- `TenantId`: Your Azure AD tenant ID (or "common" for multi-tenant)
- `Audience`: The Application (client) ID from your API app registration

### 3. Run the API

```bash
cd src/Ansorg.Api
dotnet restore
dotnet run
```

The API will be available at `http://localhost:5000`

## Available Endpoints

### Public Endpoints
- `GET /` - Health check endpoint
- `GET /health` - Health status

### Protected Endpoints (Require Authentication)
- `GET /people` - List all people (requires `CanRead` policy)
- `GET /people/{id}` - Get person by ID (requires `CanRead` policy)
- `POST /people` - Create new person (requires `CanWrite` policy)
- `PUT /people/{id}` - Update person (requires `CanWrite` policy)
- `DELETE /people/{id}` - Delete person (requires `IsAdmin` policy)

## Authorization Policies

The API implements three authorization policies (configured in `Auth/AuthSetup.cs`):

### CanRead Policy
Requires either:
- `Ansorg.Read` scope (delegated permission)
- `Ansorg.Reader` role (application permission)

### CanWrite Policy
Requires either:
- `Ansorg.Write` scope (delegated permission)
- `Ansorg.Writer` role (application permission)

### IsAdmin Policy
Requires:
- `Ansorg.Admin` role

## Multi-tenancy

The API supports multi-tenant scenarios with optional tenant validation:

- **Tenant validation** is handled by `TenantAllowListHandler.cs`
- Configure allowed tenant IDs in `appsettings.json` (empty list = all tenants allowed)
- Tenant ID is extracted from the JWT `tid` claim

```json
{
  "Authorization": {
    "TenantAllowList": [
      "tenant-id-1",
      "tenant-id-2"
    ]
  }
}
```

## Project Structure

```
src/Ansorg.Api/
├── Program.cs                    # Application bootstrap and middleware
├── Auth/
│   ├── AuthSetup.cs             # Authentication and authorization setup
│   ├── TenantAllowedRequirement.cs
│   └── TenantAllowListHandler.cs # Multi-tenant validation
├── Endpoints/
│   └── PeopleEndpoints.cs       # API endpoint definitions
└── appsettings.json             # Configuration
```

## Authentication Flow

1. Client obtains JWT token from Microsoft Entra ID
2. Client includes token in `Authorization: Bearer {token}` header
3. API validates token signature and claims
4. API checks authorization policies (roles/scopes)
5. API validates tenant (if allow list configured)
6. Request is processed if all checks pass

## Testing with Authentication

### Using curl

```bash
# Get an access token from Azure AD first, then:
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/people
```

### Using Postman

1. Configure OAuth 2.0 authentication
2. Set Auth URL: `https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/authorize`
3. Set Token URL: `https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/token`
4. Set Client ID and Scope: `api://{api-app-id}/.default`

## Development

### Adding New Endpoints

Add endpoints to `Endpoints/PeopleEndpoints.cs` or create new endpoint groups:

```csharp
public static void MapPeopleEndpoints(this IEndpointRouteBuilder app)
{
    var group = app.MapGroup("/people");

    group.MapGet("/", () => Results.Ok(new[] { "Person 1", "Person 2" }))
        .RequireAuthorization("CanRead");
    
    // Add more endpoints...
}
```

### Modifying Authorization

Update policies in `Auth/AuthSetup.cs`:

```csharp
options.AddPolicy("CustomPolicy", policy =>
    policy.RequireRole("CustomRole")
          .RequireClaim("CustomClaim", "value"));
```

## CORS Configuration

CORS is configured in `Program.cs` to allow the frontend application:

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

## Docker Support

Build and run with Docker:

```bash
docker build -t ansorg-api .
docker run -p 5000:8080 ansorg-api
```

## Troubleshooting

### 401 Unauthorized
- Verify token is valid and not expired
- Check that `Audience` matches your API app ID
- Ensure required scopes/roles are present in the token

### 403 Forbidden
- User is authenticated but lacks required role/scope
- Check authorization policy requirements
- Verify app roles are assigned to users/applications

### Tenant Validation Fails
- Check `TenantAllowList` configuration
- Verify tenant ID in JWT matches allowed tenants
- Use empty allow list to disable tenant validation

## Built With

- [.NET 9](https://dotnet.microsoft.com/) - Framework
- [Microsoft.Identity.Web](https://github.com/AzureAD/microsoft-identity-web) - Authentication library
- [Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis) - Endpoint routing

## Learn More

- [Microsoft Entra ID Documentation](https://learn.microsoft.com/en-us/entra/identity/)
- [Microsoft.Identity.Web Documentation](https://learn.microsoft.com/en-us/entra/msal/dotnet/microsoft-identity-web/)
- [ASP.NET Core Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis)
- [Protected Web API Tutorial](https://learn.microsoft.com/en-us/entra/identity-platform/scenario-protected-web-api-overview)
