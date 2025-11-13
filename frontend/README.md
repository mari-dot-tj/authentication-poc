# Ansorg API Frontend

A React TypeScript frontend application with Microsoft Entra ID (Azure AD) authentication integration.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Microsoft Entra ID application registration

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Authentication

Create a local configuration file with your Azure AD credentials:

1. Copy the example configuration file:
   ```bash
   cp src/auth/authConfig.local.example.ts src/auth/authConfig.local.ts
   ```

2. Edit `src/auth/authConfig.local.ts` and replace the placeholders with your actual values:

```typescript
export const msalConfig: Configuration = {
    auth: {
        clientId: "your-client-app-id", // Your client app registration ID
        authority: "https://login.microsoftonline.com/your-tenant-id",
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
    scopes: ["api://your-api-app-id/.default"]
};
```

**Required Configuration:**
- `clientId`: The Application (client) ID from your Azure AD app registration (frontend/SPA)
- `authority`: Your tenant ID in the format `https://login.microsoftonline.com/{tenant-id}`
- `redirectUri`: Must match the redirect URI configured in your Azure AD app registration
- `apiConfig.scopes`: The API scope in format `api://{api-app-id}/.default`

**Note:** The `authConfig.local.ts` file is excluded from git to keep your credentials safe. Never commit this file.

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the Vite development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build locally

## Project Structure

```
frontend/
├── src/
│   ├── auth/              # Authentication configuration and hooks
│   │   ├── authConfig.ts  # MSAL and API configuration
│   │   ├── useAuth.ts     # Authentication hook
│   │   └── AppProvider.tsx # MSAL provider wrapper
│   ├── components/        # React components
│   │   ├── Navbar.tsx     # Navigation bar
│   │   ├── Login.tsx      # Login page
│   │   ├── Home.tsx       # Home page
│   │   └── People.tsx     # People directory
│   ├── styles/           # Global styles
│   └── main.tsx          # Application entry point
└── package.json
```

## Authentication Flow

1. User clicks "Sign in with Microsoft" on the login page
2. MSAL redirects to Microsoft Entra ID for authentication
3. After successful login, user is redirected back to the application
4. Access tokens are acquired silently for API calls
5. Tokens are automatically included in API requests via the `useAuth` hook

## Features

- **Microsoft Entra ID Integration**: Secure authentication using MSAL
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Token Management**: Silent token acquisition for API calls
- **Responsive Design**: Mobile-friendly interface
- **TypeScript**: Full type safety throughout the application

## API Integration

The frontend communicates with the .NET API at the URL configured in `apiConfig.baseUrl`. All protected API calls automatically include the Bearer token:

```typescript
const { getToken } = useAuth();
const token = await getToken();

const response = await fetch(`${apiConfig.baseUrl}/people`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
});
```

## Troubleshooting

### Redirect URI Mismatch
Ensure the `redirectUri` in `authConfig.ts` matches exactly what's configured in your Azure AD app registration.

### CORS Errors
Make sure the .NET API has CORS configured to allow requests from `http://localhost:5173` (see `Program.cs` in the API project).

### Token Scope Issues
Verify that the API scope in `apiConfig.scopes` matches the Application ID URI configured in your API's Azure AD app registration.

## Built With

- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vite.dev/) - Build tool and dev server
- [MSAL React](https://github.com/AzureAD/microsoft-authentication-library-for-js) - Microsoft authentication
- [React Router](https://reactrouter.com/) - Routing
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

## Learn More

- [Microsoft Entra ID Documentation](https://learn.microsoft.com/en-us/entra/identity/)
- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)
- [React Documentation](https://react.dev/)
