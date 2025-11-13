import type { Configuration, PopupRequest } from "@azure/msal-browser";

// MSAL configuration
export const msalConfig: Configuration = {
    auth: {
        clientId: "YOUR_CLIENT_ID", // Replace with your actual client app registration ID
        authority: "https://login.microsoftonline.com/YOUR_TENANT_ID", // Replace with your actual tenant ID
        redirectUri: "http://localhost:5173",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};

export const loginRequest: PopupRequest = {
    scopes: ["openid", "profile"]
};

export const apiConfig = {
    baseUrl: "http://localhost:5143",
    scopes: ["api://YOUR_API_APP_ID/.default"] // Replace with your actual API app ID
};
