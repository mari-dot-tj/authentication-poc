import { useAuth } from "../auth/useAuth";
import "../styles/global.css";
import { FaMicrosoft } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";

export default function Login() {
    const { instance } = useMsal();
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Auth state changed:", { isAuthenticated });
        if (isAuthenticated) {
            console.log("Redirecting to /home");
            navigate("/home", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async () => {
        try {
            await login();
            const account = instance.getActiveAccount();
            console.log("Login successful, account:", account);
            if (account) {
                navigate("/home", { replace: true });
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="container" style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="card" style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
                <h1 className="title">Welcome to Ansorg API</h1>
                <p className="subtitle">Secure, multi-tenant API platform with Microsoft Entra ID integration</p>
                <button 
                    onClick={handleLogin}
                    className="button"
                    style={{ width: "100%", justifyContent: "center", marginTop: "2rem" }}
                >
                    <FaMicrosoft />
                    Sign in with Microsoft
                </button>
            </div>
        </div>
    );
}