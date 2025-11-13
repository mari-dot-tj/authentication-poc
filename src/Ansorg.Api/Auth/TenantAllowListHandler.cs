using System.Security.Claims;
using Auth;
using Microsoft.AspNetCore.Authorization;

namespace Ansorg.Api.Auth;

public sealed class TenantAllowListHandler : AuthorizationHandler<TenantAllowedRequirement>
{
    private readonly HashSet<string> _allowedTenants;

    public TenantAllowListHandler(IEnumerable<string> tenants)
    {
        _allowedTenants = new HashSet<string>(tenants ?? Array.Empty<string>(), StringComparer.OrdinalIgnoreCase);
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, TenantAllowedRequirement requirement)
    {
        if (_allowedTenants.Count == 0)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        var tid = context.User.FindFirstValue("tid");
        if (!string.IsNullOrWhiteSpace(tid) && _allowedTenants.Contains(tid))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
