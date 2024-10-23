import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SelectCompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem('jwt_token');

      if (token) {
        try {
          const response = await axios.get('https://localhost/api/select', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data.companies) {
            setCompanies(response.data.companies);
          } else {
            setError('Aucune entreprise trouvée.');
          }
        } catch (err) {
          if (err.response) {
            setError(err.response.data.message || 'Erreur inconnue lors de la récupération des sociétés.');
          } else if (err.request) {
            setError('Problème de connexion avec le serveur.');
          } else {
            setError('Une erreur est survenue.');
          }
        }
      } else {
        setError('Vous devez être connecté pour accéder à cette page.');
      }
    };

    fetchCompanies();
  }, []);

  // Fonction pour gérer la sélection et le stockage de la société
  const handleCompanySelect = (companyId) => {
    setSelectedCompany(companyId);
    localStorage.setItem('selected_company_id', companyId);
    console.log('Company selected and stored:', companyId);
  };

  // Fonction pour gérer le changement de rôle
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    console.log('Role selected:', e.target.value);
  };

  // Fonction pour attribuer un rôle à l'utilisateur pour la société sélectionnée
  const handleRoleAssign = async () => {
    const token = localStorage.getItem('jwt_token');
    const companyId = localStorage.getItem('selected_company_id');

    if (token && companyId && role) {
      try {
        const response = await axios.post('https://localhost/api/assign-role', {
          company_id: companyId,
          role: role,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          alert('Rôle attribué avec succès');
          navigate('/dashboard');
        }
      } catch (err) {
        let errorMessage = 'Erreur lors de l\'assignation du rôle';
        if (err.response) {
          errorMessage = err.response.data.message || errorMessage;
        } else if (err.request) {
          errorMessage = 'Problème de connexion avec le serveur.';
        }
        alert(errorMessage);
      }
    } else {
      alert('Sélectionnez une société et un rôle valide.');
    }
  };

  return (
    <Container>
      <Title>Sélectionnez votre entreprise et votre rôle</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <CompanyList>
        {companies.length > 0 ? (
          companies.map((company) => (
            <CompanyItem key={company.id}>
              {company.name}
              <button onClick={() => handleCompanySelect(company.id)}>
                Sélectionner cette entreprise
              </button>
            </CompanyItem>
          ))
        ) : (
          <p>Vous n'avez aucune entreprise à affichée pour le moment.</p>
        )}
      </CompanyList>

      {selectedCompany && (
        <div>
          <select onChange={handleRoleChange} value={role}>
            <option value="">Sélectionner un rôle</option>
            <option value="ROLE_ADMIN">Admin</option>
            <option value="ROLE_CONSULTANT">Consultant</option>
            <option value="ROLE_MANAGER">Manager</option>
          </select>
          <button onClick={handleRoleAssign}>Assigner un rôle</button>
        </div>
      )}
    </Container>
  );
};

export default SelectCompanyPage;

// Styles
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f9;
  color: #333;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const CompanyList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 80%;
  max-width: 600px;
`;

const CompanyItem = styled.li`
  background-color: white;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 1.2rem;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 15px;
  text-align: center;
`;
