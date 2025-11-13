import { useAuth } from "../auth/useAuth";
import { Link, useLocation } from "react-router-dom";
import "../styles/global.css";
import { FaHome, FaUsers, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();

    return (
        <nav className="nav">
            <div className="container">
                <div className="navContent">
                    <div className="navLinks">
                        <Link 
                            to="/" 
                            className={`link ${location.pathname === '/' ? 'activeLink' : ''}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <FaHome /> Home
                        </Link>
                        {isAuthenticated && (
                            <Link 
                                to="/people" 
                                className={`link ${location.pathname === '/people' ? 'activeLink' : ''}`}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <FaUsers /> People
                            </Link>
                        )}
                    </div>
                    {isAuthenticated && (
                        <button 
                            onClick={logout} 
                            className="button"
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            <FaSignOutAlt />
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}