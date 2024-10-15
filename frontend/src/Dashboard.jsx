import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('jwt_token');

            if (token) {
                try {
                    const response = await axios.get('https://localhost/api/dashboard', {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.data) {
                        setUserData(response.data);
                    }
                } catch (err) {
                    if (err.response) {
                        setError(`Erreur serveur: ${err.response.data.message || 'Erreur inconnue'}`);
                    } else if (err.request) {
                        setError('Erreur de connexion: Le serveur ne répond pas.');
                    } else {
                        setError(`Erreur: ${err.message}`);
                    }
                }
            } else {
                setError('Vous devez être connecté pour accéder au dashboard');
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <Container>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {userData ? (
                <WelcomeMessage>
                    <h1>{userData.message}</h1>
                    <p>Entreprise: {userData.company}</p>
                    <p>Rôles: {userData.roles.join(', ')}</p>  {/* Affichage des rôles */}
                </WelcomeMessage>
            ) : (
                <p>Chargement des données...</p>
            )}
        </Container>
    );
};

export default Dashboard;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f9;
  color: #333;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  font-size: 1.5rem;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 15px;
  text-align: center;
`;
