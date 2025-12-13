import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DynamicTable from './components/DynamicTable';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_BASE_URL}/clients`);

            if (response.data.success) {
                setClients(response.data.data);
            } else {
                setError('Failed to fetch clients');
            }
        } catch (err) {
            console.error('Error fetching clients:', err);
            setError(err.response?.data?.message || 'Unable to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <div className="container">
                <header className="app-header">
                    <div className="header-content">
                        <h1>Client Management</h1>
                        <p className="subtitle">Dynamic JSON to UI - Assignment 6</p>
                    </div>
                    <button onClick={fetchClients} className="refresh-btn" disabled={loading}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                        </svg>
                        Refresh
                    </button>
                </header>

                <main>
                    {loading && (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading clients...</p>
                        </div>
                    )}

                    {error && (
                        <div className="error-container">
                            <div className="error-icon">⚠️</div>
                            <h3>Error Loading Data</h3>
                            <p>{error}</p>
                            <button onClick={fetchClients} className="retry-btn">
                                Try Again
                            </button>
                        </div>
                    )}

                    {!loading && !error && clients.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h3>No Clients Found</h3>
                            <p>There are no clients in the database yet.</p>
                        </div>
                    )}

                    {!loading && !error && clients.length > 0 && (
                        <DynamicTable
                            data={clients}
                            title="Clients"
                            subtitle={`${clients.length} ${clients.length === 1 ? 'client' : 'clients'} in database`}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}

export default App;
