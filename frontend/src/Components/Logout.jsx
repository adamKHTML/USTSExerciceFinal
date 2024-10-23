import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            try {
                const response = await axios.post('https://localhost/api/logoff', {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Réponse de déconnexion:', response); // Log de la réponse
                localStorage.removeItem('jwt_token');
                alert('Déconnexion réussie');
                navigate('/'); // Redirection après déconnexion
            } catch (error) {
                // Gestion des erreurs détaillée
                if (error.response) {
                    // Le serveur a répondu avec un code d'erreur
                    console.error('Erreur de déconnexion:', error.response.data);
                    alert('Erreur de déconnexion: ' + (error.response.data.message || 'Erreur inconnue.'));
                } else if (error.request) {
                    // La requête a été faite mais aucune réponse n'a été reçue
                    console.error('Aucune réponse reçue:', error.request);
                    alert('Erreur de réseau: Aucune réponse du serveur.');
                } else {
                    // Quelque chose a causé une erreur lors de la configuration de la requête
                    console.error('Erreur:', error.message);
                    alert('Erreur: ' + error.message);
                }
            }
        }
    };



    return (


        <LogoutSection>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </LogoutSection>

    );
};




export default Logout;




const LogoutSection = styled.div`

  display: flex;
  flex-direction: column-reverse;

`;

const LogoutButton = styled.button`
    background-color: #2c3e50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
        background-color: #ef41b5;
    }
`;
