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
                console.log('Réponse de déconnexion:', response);
                localStorage.removeItem('jwt_token');
                alert('Déconnexion réussie');
                navigate('/');
            } catch (error) {

                if (error.response) {

                    console.error('Erreur de déconnexion:', error.response.data);
                    alert('Erreur de déconnexion: ' + (error.response.data.message || 'Erreur inconnue.'));
                } else if (error.request) {

                    console.error('Aucune réponse reçue:', error.request);
                    alert('Erreur de réseau: Aucune réponse du serveur.');
                } else {

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
