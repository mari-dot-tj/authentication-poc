// export default function Home() {
//     return (
//         <div style={{ padding: "2rem" }}>
//             <h1>Welcome to Ansorg API Demo</h1>
//             <p>This is a demo of Microsoft Entra ID SSO integration.</p>
//         </div>
//     );
// }

import { type FC } from "react";
import "../styles/global.css";
import { FaShieldAlt, FaUserFriends, FaLock } from 'react-icons/fa';

const Home: FC = () => {
    return (
        <div className="homeContainer">
            <h1 className="title">Welcome to Ansorg API Demo</h1>
            <p className="subtitle">A modern, secure, multi-tenant API platform with Microsoft Entra ID integration.</p>
            
            <div className="grid">
                <div className="card">
                    <FaShieldAlt size={32} color="#3B82F6" style={{ marginBottom: "1rem" }} />
                    <h2 style={{ marginBottom: "1rem", color: "#F9FAFB" }}>Secure Authentication</h2>
                    <p style={{ color: "#D1D5DB", lineHeight: "1.6" }}>
                        Powered by Microsoft Entra ID, providing enterprise-grade security and SSO capabilities.
                    </p>
                </div>

                <div className="card">
                    <FaUserFriends size={32} color="#3B82F6" style={{ marginBottom: "1rem" }} />
                    <h2 style={{ marginBottom: "1rem", color: "#F9FAFB" }}>Multi-tenant Ready</h2>
                    <p style={{ color: "#D1D5DB", lineHeight: "1.6" }}>
                        Built for organizations with robust tenant isolation and access controls.
                    </p>
                </div>

                <div className="card">
                    <FaLock size={32} color="#3B82F6" style={{ marginBottom: "1rem" }} />
                    <h2 style={{ marginBottom: "1rem", color: "#F9FAFB" }}>Role-Based Access</h2>
                    <p style={{ color: "#D1D5DB", lineHeight: "1.6" }}>
                        Granular permissions with role-based and claim-based authorization.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;