# AI Agent Instructions for Ansorg API

## Project Overview
This is a multi-tenant protected API using Microsoft Entra ID (formerly Azure AD) for authentication and authorization. The API demonstrates minimal but production-ready patterns for building secure, multi-tenant services on .NET.

## Key Architecture Components

### Authentication & Authorization
- Microsoft Entra ID integration is configured in `src/Ansorg.Api/Auth/AuthSetup.cs`
- Uses JWT Bearer authentication with Microsoft.Identity.Web
- Implements role-based and claim-based authorization policies:
  - `CanRead`: Requires `Ansorg.Read` scope or `Ansorg.Reader` role
  - `CanWrite`: Requires `Ansorg.Write` scope or `Ansorg.Writer` role
  - `IsAdmin`: Requires `Ansorg.Admin` role

### Multi-tenancy
- Tenant validation is handled by `TenantAllowListHandler.cs`
- Validates tenant IDs (from JWT claims) against an allowed list
- Empty allow list means all tenants are permitted

### API Endpoints
- Defined in `src/Ansorg.Api/Endpoints/PeopleEndpoints.cs`
- Uses minimal API style with grouped endpoint definitions
- Authorization requirements are applied using the `.RequireAuthorization()` extension
- Example endpoint structure:
  ```csharp
  app.MapGet("/people", () => handler)
      .RequireAuthorization("CanRead");
  ```

## Development Workflows

### Configuration
Required configuration in `appsettings.json`:
```json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "TenantId": "your-tenant-id",
    "Audience": "your-api-app-id"
  }
}
```

### Local Development
1. Register an application in Microsoft Entra ID
2. Configure the application with appropriate app roles and API permissions
3. Update `appsettings.Development.json` with your app registration details
4. Run using `dotnet run` in the `src/Ansorg.Api` directory

### Authentication Testing
- Anonymous endpoints: `/` and `/health`
- Protected endpoints require valid JWT tokens with appropriate roles/claims
- Use Microsoft Entra ID application registration portal to manage roles and API permissions

## Common Tasks

### Adding New Endpoints
1. Add endpoint to `PeopleEndpoints.cs` (or create new endpoint group)
2. Apply appropriate authorization policy using `.RequireAuthorization()`
3. Consider adding tenant validation if required

### Modifying Authorization
- Update policies in `AuthSetup.cs` to add/modify roles or claims
- Tenant allowlist is configured via configuration (see `TenantAllowListHandler.cs`)

## Project Structure Patterns
- Minimal API endpoints are grouped by feature in the `Endpoints` folder
- Authorization logic is centralized in the `Auth` folder
- Uses static extension methods for service configuration

## Notable Files
- `Program.cs`: Application bootstrap and middleware configuration
- `AuthSetup.cs`: Authentication and authorization policy setup
- `PeopleEndpoints.cs`: Example API endpoint implementation
- `TenantAllowListHandler.cs`: Multi-tenant validation logic