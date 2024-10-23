import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Header from '../../Components/Header';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [nonCompanyUsers, setNonCompanyUsers] = useState([]);
    const [formData, setFormData] = useState({ userId: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('jwt_token');
        const companyId = localStorage.getItem('selected_company_id');

        if (!companyId) {
            setError('ID de la société manquant dans le stockage local');
            return;
        }

        if (token) {
            try {
                const response = await axios.get('https://localhost/api/users', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { company_id: companyId },
                });
                setUsers(response.data);
            } catch {
                setError('Erreur lors de la récupération des utilisateurs.');
            }

            try {
                const response = await axios.get('https://localhost/api/users/non-company', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { company_id: companyId },
                });
                setNonCompanyUsers(response.data);
            } catch {
                setError('Erreur lors de la récupération des utilisateurs non affiliés.');
            }
        } else {
            setError('Veuillez vous connecter et sélectionner une société');
        }
    };

    const addUserToCompany = async (userId) => {
        const token = localStorage.getItem('jwt_token');
        const companyId = localStorage.getItem('selected_company_id');

        if (!companyId) {
            setError('ID de la société manquant dans le stockage local');
            return;
        }

        if (token && userId) {
            try {
                const response = await axios.post(
                    'https://localhost/api/users/add',
                    { user_id: userId, company_id: companyId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setUsers([...users, response.data]);
                setNonCompanyUsers(nonCompanyUsers.filter(user => user.id !== userId));
            } catch {
                setError("Erreur lors de l'ajout de l'utilisateur à la société.");
            }
        }
    };

    const removeUser = async (userId) => {
        const token = localStorage.getItem('jwt_token');
        const companyId = localStorage.getItem('selected_company_id');

        if (!companyId) {
            setError('ID de la société manquant dans le stockage local');
            return;
        }

        if (token && userId) {
            const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
            if (confirmDelete) {
                try {
                    await axios.delete(`https://localhost/api/users/remove/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { company_id: companyId },
                    });
                    setUsers(users.filter((user) => user.id !== userId));
                    setNonCompanyUsers([...nonCompanyUsers, { id: userId }]);
                    alert("Utilisateur supprimé avec succès."); // Alerte de succès
                } catch {
                    setError("Erreur lors de la suppression de l'utilisateur.");
                }
            }
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>

            <Header />
            <Container>
                <h1>Gestion des Utilisateurs</h1>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <Form onSubmit={(e) => {
                    e.preventDefault();
                    addUserToCompany(formData.userId);
                }}>
                    <select
                        name="userId"
                        value={formData.userId}
                        onChange={handleInputChange}
                    >
                        <option value="">Sélectionner un utilisateur</option>
                        {nonCompanyUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.email}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Ajouter l'utilisateur</button>
                </Form>
                {users.length === 0 ? (
                    <p>Aucun utilisateur trouvé.</p>
                ) : (
                    <UserList>
                        {users.map((user) => (
                            <UserItem key={user.id}>
                                <p>{user.email}</p>
                                <button onClick={() => removeUser(user.id)}>Retirer</button>
                            </UserItem>
                        ))}
                    </UserList>
                )}
            </Container>
        </>
    );
};

export default UserManagement;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  margin-bottom: 20px;

  select {
    margin-bottom: 10px;
    padding: 8px;
    font-size: 1rem;
  }

  button {
    padding: 10px;
    font-size: 1rem;
    background-color: #3498db;
    color: white;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #2980b9;
    }
  }
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
`;

const UserItem = styled.div`
  background-color: #ecf0f1;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;

  p {
    margin: 0 0 10px;
  }

  button {
    padding: 5px;
    font-size: 0.9rem;
    background-color: #e74c3c;
    color: white;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #c0392b;
    }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 20px;
`;
