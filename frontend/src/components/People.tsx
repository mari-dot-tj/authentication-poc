import { useState, useEffect } from "react";
import { useAuth } from "../auth/useAuth";
import { apiConfig } from "../auth/authConfig";
import "../styles/global.css";
import { FaUserCircle, FaSpinner } from 'react-icons/fa';

export default function People() {
    const [people, setPeople] = useState<string[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchPeople = async () => {
            try {
                setLoading(true);
                const token = await getToken();
                const response = await fetch(`${apiConfig.baseUrl}/people`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setPeople(data);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to fetch people");
            } finally {
                setLoading(false);
            }
        };

        fetchPeople();
    }, [getToken]);

    return (
        <div className="container">
            <h1 className="title">People Directory</h1>
            <p className="subtitle">Manage and view people in your organization</p>

            <div className="card">
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                        <FaSpinner className="icon-spin" style={{ fontSize: '2rem', color: '#3B82F6' }} />
                    </div>
                ) : error ? (
                    <div style={{ 
                        padding: '1rem', 
                        backgroundColor: '#FEE2E2', 
                        color: '#DC2626',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                        {error}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {people.map((person, index) => (
                            <div 
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    backgroundColor: 'var(--surface-light)',
                                    borderRadius: '0.5rem'
                                }}
                            >
                                <FaUserCircle style={{ fontSize: '1.5rem', color: '#3B82F6' }} />
                                <span>{person}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}