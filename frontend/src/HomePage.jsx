import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';


const HomePage = () => {
    return (
        <Container>
            <Title>Bienvenue sur notre application!</Title>
            <Message>
                Ceci est une page d'accueil où vous pouvez vous connecter pour accéder à vos projets et sociétés.
            </Message>
            <Link to="/login">
                <Button>Se connecter</Button>
            </Link>
        </Container>
    );
};

export default HomePage;

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
  font-size: 3rem;
  margin-bottom: 20px;
  color: #007bff;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;
