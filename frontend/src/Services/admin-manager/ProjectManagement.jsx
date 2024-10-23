import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Header from '../../Components/Header';

const ProjectManagement = () => {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [selectedProject, setSelectedProject] = useState(null);
    const [error, setError] = useState('');

    // Function to handle errors with more specific messages
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
                            company_id: companyId, // Envoie l'ID comme paramètre
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





    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt_token');
        const companyId = localStorage.getItem('selected_company_id');

        console.log('Company selected and stored:', companyId);

        if (!companyId) {
            setError('ID de la société manquant dans le stockage local');
            return;
        }

        if (token && companyId) {
            try {
                const response = await axios.post(
                    `https://localhost/api/projects/create?company_id=${companyId}`,
                    { ...formData },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setProjects([...projects, response.data]);
                setFormData({ title: '', description: '' });
            } catch (err) {
                handleError(err);
            }
        }
    };


    const handleUpdateProject = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt_token');
        const companyId = localStorage.getItem('selected_company_id');
        if (token && companyId && selectedProject) {
            try {
                const response = await axios.put(
                    `https://localhost/api/projects/edit/${selectedProject.id}`,
                    { ...formData },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setProjects(
                    projects.map((project) =>
                        project.id === selectedProject.id ? response.data : project
                    )
                );
                setSelectedProject(null);
                setFormData({ title: '', description: '' });
            } catch (err) {
                handleError(err);
            }
        }
    };

    const handleDeleteProject = async (projectId) => {
        const token = localStorage.getItem('jwt_token');
        const companyId = localStorage.getItem('selected_company_id');
        if (token && companyId) {
            try {
                await axios.delete(`https://localhost/api/projects/delete/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProjects(projects.filter((project) => project.id !== projectId));
            } catch (err) {
                handleError(err);
            }
        }
    };

    return (
        <>

            <Header />

            <Container>
                <h1>Gestion des Projets</h1>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <Form onSubmit={selectedProject ? handleUpdateProject : handleCreateProject}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Titre du projet"
                        value={formData.title}
                        onChange={handleInputChange}
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                    <button type="submit">
                        {selectedProject ? 'Mettre à jour' : 'Créer'}
                    </button>
                </Form>

                {/* Vérifiez si la liste des projets est vide */}
                {projects.length === 0 ? (
                    <p>Aucun projet à afficher.</p>
                ) : (
                    <ProjectList>
                        {projects.map((project) => (
                            <ProjectItem key={project.id}>
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                                <p><strong>Créé le :</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
                                <button onClick={() => {
                                    setSelectedProject(project);
                                    setFormData({ title: project.title, description: project.description });
                                }}>
                                    Modifier
                                </button>
                                <button onClick={() => handleDeleteProject(project.id)}>Supprimer</button>
                            </ProjectItem>
                        ))}
                    </ProjectList>
                )}
            </Container>
        </>
    );
};

export default ProjectManagement;

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

  input, textarea {
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

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 20px;
`;
