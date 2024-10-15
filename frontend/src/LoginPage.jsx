import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Données envoyées :", { email, password });

    try {
      // Effectuer la requête de connexion sans CSRF
      const response = await axios.post('https://localhost/api/login', { email, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Réponse du serveur :", response);

      if (response.data.token) {
        localStorage.setItem('jwt_token', response.data.token);  // Stocker le JWT
        navigate('/select');  // Rediriger vers la page des sociétés
      }
    } catch (error) {
      if (error.response) {
        console.error("Erreur serveur :", error.response);
        setError(error.response.data.error || 'Erreur inconnue, veuillez réessayer.');
      } else {
        console.error("Erreur de connexion :", error);
        setError('Impossible de se connecter au serveur.');
      }
    }
  };


  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Connexion</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Se connecter</Button>
      </Form>
    </Container>
  );
};

export default LoginPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f9;
  color: #333;
`;

const Form = styled.form`
  width: 300px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 15px;
  text-align: center;
`;
