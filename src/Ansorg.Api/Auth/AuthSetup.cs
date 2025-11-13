using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Validators;

namespace Ansorg.Api.Auth;

public static class AuthSetupExtensions
{
    public static IServiceCollection AddAnsorgAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddMicrosoftIdentityWebApi(jwtOptions =>
            {
                var instance = configuration["AzureAd:Instance"];
                var tenantId = configuration["AzureAd:TenantId"];
                var authority = $"{instance}{tenantId}/v2.0";

                jwtOptions.TokenValidationParameters.ValidAudience = configuration["AzureAd:Audience"];
                jwtOptions.TokenValidationParameters.ValidIssuer = null;
                jwtOptions.TokenValidationParameters.ValidateIssuer = true;
                jwtOptions.TokenValidationParameters.IssuerValidator = AadIssuerValidator.GetAadIssuerValidator(authority).Validate;
            },
            microsoftIdentityOptions =>
            {
                configuration.Bind("AzureAd", microsoftIdentityOptions);
            });

        services.AddAuthorizationBuilder()
            .AddPolicy("CanRead", policy =>
                policy.RequireAssertion(ctx =>
                    ctx.User.HasClaim(c => c.Type == "scp" && c.Value.Split(' ').Contains("Ansorg.Read"))
                    || ctx.User.IsInRole("Ansorg.Reader")))
            .AddPolicy("CanWrite", policy =>
                policy.RequireAssertion(ctx =>
                    ctx.User.HasClaim(c => c.Type == "scp" && c.Value.Split(' ').Contains("Ansorg.Write"))
                    || ctx.User.IsInRole("Ansorg.Writer")))
            .AddPolicy("IsAdmin", policy =>
                policy.RequireRole("Ansorg.Admin"));

        return services;
    }
}