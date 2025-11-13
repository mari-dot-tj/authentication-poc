import type { Configuration, PopupRequest } from "@azure/msal-browser";

// Try to import local config, fall back to placeholders if not found
let localConfig;
try {
    localConfig = await import('./authConfig.local');
} catch {
    // Local config not found, will use placeholders below
}

// MSAL configuration
export const msalConfig: Configuration = localConfig?.msalConfig ?? {
    auth: {
        clientId: "YOUR_CLIENT_ID", // Replace with your client app registration ID
        authority: "https://login.microsoftonline.com/YOUR_TENANT_ID", // Replace with your tenant ID
        redirectUri: "http://localhost:5173", // Vite's default dev server port
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = localConfig?.loginRequest ?? {
    scopes: ["openid", "profile"]
};

// API configuration
export const apiConfig = localConfig?.apiConfig ?? {
    baseUrl: "http://localhost:5143", // Your .NET API port
    scopes: ["api://YOUR_API_APP_ID/.default"] // Replace with your API app ID
};