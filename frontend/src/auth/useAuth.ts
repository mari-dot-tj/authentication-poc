import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

export function useAuth() {
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();

    const login = async () => {
        try {
            const response = await instance.loginPopup(loginRequest);
            if (response) {
                // Set the active account after successful login
                instance.setActiveAccount(response.account);
                return response;
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        instance.logout();
    };

    const getToken = async () => {
        try {
            const account = instance.getActiveAccount();
            if (!account) {
                throw new Error("No active account!");
            }

            const response = await instance.acquireTokenSilent({
                ...loginRequest,
                account,
            });
            return response.accessToken;
        } catch (error) {
            console.error("Get token failed:", error);
            throw error;
        }
    };

    return {
        isAuthenticated,
        login,
        logout,
        getToken,
    };
}