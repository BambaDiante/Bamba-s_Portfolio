import { useEffect, useState } from 'react';
import api from '../services/api';

function Projet() {
    const [projects, setProjects] = useState([]);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        api.get('/projects')
            .then(response => {
                setProjects(Array.isArray(response.data) ? response.data : []);
                setStatus('ready');
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des projets :", error);
                setStatus('error');
            });
    }, []);

    return (
        <section className="projects-section" aria-labelledby="projects-title">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Sélection</p>
                    <h2 id="projects-title">Mes projets</h2>
                </div>
                <span className="project-count">{projects.length.toString().padStart(2, '0')} projets</span>
            </div>

            {status === 'loading' && <p className="feedback">Chargement des projets...</p>}
            {status === 'error' && <p className="feedback feedback-error">Impossible de charger les projets.</p>}
            {status === 'ready' && projects.length === 0 && <p className="feedback">Aucun projet publié pour le moment.</p>}

            {projects.length > 0 && (
                <div className="project-grid">
                    {projects.map((project) => {
                        const title = project.title ?? project.nom ?? 'Projet sans titre';
                        const image = project.image_path ?? project.projects_image;
                        const stack = project.stack ?? 'Stack à venir';

                        return (
                            <article className="project-card" key={project.id}>
                                <div className="project-visual">
                                    {image ? <img src={image} alt={`Aperçu de ${title}`} /> : <span>Projet</span>}
                                </div>
                                <div className="project-content">
                                    <p className="project-index">{String(project.id).padStart(2, '0')}</p>
                                    <h3>{title}</h3>
                                    <p className="project-description">{project.description}</p>
                                    <div className="project-footer">
                                        <span className="project-stack">{stack}</span>
                                        {(project.demo_url ?? project.url) && (
                                            <a href={project.demo_url ?? project.url} target="_blank" rel="noreferrer">
                                                Voir le projet
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default Projet;