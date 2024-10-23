import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Header from '../../Components/Header';

const ProjectConsulting = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');


    const handleError = (err) => {
        if (err.response) {
            setError(`Erreur ${err.response.status}: ${err.response.data.error || 'Un problème est survenu'}`);
        } else {
            setError('Erreur réseau ou serveur');
        }
    };

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('jwt_token');
            const companyId = localStorage.getItem('selected_company_id');

            if (!companyId) {
                setError('ID de la société manquant dans le stockage local');
                return;
            }
            console.log('Company selected and stored:', companyId);

            if (token) {
                try {
                    const response = await axios.get('https://localhost/api/projects', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {
                            company_id: companyId,
                        },
                    });

                    if (Array.isArray(response.data) && response.data.length > 0) {
                        setProjects(response.data);
                    } else {
                        setProjects([]);
                        setError('Aucun projet trouvé.');
                    }
                } catch (err) {
                    handleError(err);
                }
            } else {
                setError('Veuillez vous connecter et sélectionner une société');
            }
        };

        fetchProjects();
    }, []);

    return (
        <>
            <Header />
            <Container>

                {projects.length === 0 ? (
                    <p>Aucun projet pour le moment.</p>
                ) : (
                    <ProjectList>
                        {projects.map((project) => (
                            <ProjectItem key={project.id}>
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                                <p><strong>Créé le :</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
                            </ProjectItem>
                        ))}
                    </ProjectList>
                )}
            </Container>
        </>
    );
};

export default ProjectConsulting;

const Container = styled.div`
display: flex;
flex-direction: column;
align-items: center;
padding: 20px;
`;



const ProjectList = styled.div`
display: flex;
flex-direction: column;
width: 100%;
max-width: 600px;
`;

const ProjectItem = styled.div`
background-color: #ecf0f1;
padding: 15px;
margin-bottom: 10px;
border-radius: 5px;

h3 {
margin: 0;
}

p {
margin: 10px 0;
}

button {
margin-right: 10px;
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


