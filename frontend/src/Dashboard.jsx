import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Logout from './Components/Logout';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('jwt_token');
            const companyId = localStorage.getItem('selected_company_id');
            console.log('Company ID:', companyId);

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

    const renderSidebar = () => {
        if (!userData) return null;

        const { roles } = userData;




        return (
            <Sidebar>
                <ul>
                    {roles.includes('ROLE_ADMIN') && (
                        <>
                            <li><a href="/user-management">Gestion utilisateurs</a></li>
                            <li><a href="/project-management">Gestion projets</a></li>
                        </>
                    )}
                    {roles.includes('ROLE_MANAGER') && (
                        <>
                            <li><a href="/project-management">Gestion projets</a></li>
                        </>
                    )}
                    {roles.includes('ROLE_CONSULTANT') && (
                        <>
                            <li><a href="/project-consulting">Consultation projets</a></li>
                        </>
                    )}
                </ul>
                <div>
                    <Logout />
                </div>
            </Sidebar>
        );
    };


    const formatRoles = (roles) => {
        return roles
            .filter(role => role !== 'ROLE_USER')
            .map(role => {
                switch (role) {
                    case 'ROLE_ADMIN':
                        return 'Admin';
                    case 'ROLE_MANAGER':
                        return 'Manager';
                    case 'ROLE_CONSULTANT':
                        return 'Consultant';
                    default:
                        return role;
                }
            }).join(', ');
    };

    const getUserNameFromEmail = (email) => {
        return email.split('@')[0];
    };

    return (
        <Container>
            <DashboardWrapper>
                {renderSidebar()}
                <MainContentWrapper>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {userData ? (
                        <>
                            <Header>
                                <h1>Bienvenue à toi, {formatRoles(userData.roles)} {getUserNameFromEmail(userData.email)} !</h1>
                            </Header>

                        </>
                    ) : (
                        <p>Chargement des données...</p>
                    )}
                </MainContentWrapper>
            </DashboardWrapper>
        </Container>
    );
};

export default Dashboard;

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f4f4f9;
  color: #333;
`;

const DashboardWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  ul {
    list-style: none;
    padding: 0;
    margin-top: 20px;
    li {
      margin-bottom: 15px;
      transition: transform 0.3s ease; 
      a {
        color: white;
        text-decoration: none;
        font-size: 1.2rem;
      }
    
      &:hover {
        transform: scale(1.2);
      }
    
      &:focus,
      &:active {
        transform: scale(1.2);
      }
    }
  }
`;

const MainContentWrapper = styled.div`
  flex: 1;
  margin-left: 250px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  text-align: center;
  font-size: 1rem;
  margin-bottom: 20px;
`;



const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 15px;
  text-align: center;
`;
