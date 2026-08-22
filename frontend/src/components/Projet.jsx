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
                    <h2 className="projects-title">Mes projets</h2>
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
                        const imagePath = project.image_path ?? project.projects_image;
                        
                        // URL de l'image (ajustez http://localhost:8000 selon votre environnement Docker)
                        const image = imagePath ? `http://localhost:8000${imagePath}` : null;

                        const skills = project.skills ?? [];
                        
                        // Normalisation de la stack pour affichage
                        let stackItems = [];
                        if (Array.isArray(project.stack)) {
                            stackItems = project.stack;
                        } else if (typeof project.stack === 'string') {
                            try { stackItems = JSON.parse(project.stack); } 
                            catch { stackItems = project.stack.split(',').map(s => s.trim()); }
                        }

                        return (
                            <article className="project-card" key={project.id}>
                                <div className="project-visual">
                                    {image ? (
                                        <img src={image} alt={`Aperçu de ${title}`} />
                                    ) : (
                                        <span className='nopic'>Sans images</span>
                                    )}
                                </div>
                                <div className="project-content">
                                    <p className="project-index">{String(project.id).padStart(2, '0')}</p>
                                    <h3>{title}</h3>
                                    <p className="project-description">{project.description}</p>
                                    
                                    <div className="project-footer">
                                        {/* Rendu des badges */}
                                        <div className="project-stack-list">
                                            {skills.length > 0 ? (
                                                skills.map((skill) => (
                                                    <span className="skill-badge" key={skill.id}>
                                                        {skill.icon_path && <img src={skill.icon_path} alt="" className="skill-icon" />}
                                                        {skill.name}
                                                    </span>
                                                ))
                                            ) : stackItems.length > 0 ? (
                                                stackItems.map((tech, index) => (
                                                    <span className="skill-badge" key={index}>{tech}</span>
                                                ))
                                            ) : (
                                                <span className="stack-placeholder">Stack à venir</span>
                                            )}
                                        </div>

                                        {(project.demo_url ?? project.url) && (
                                            <a href={project.demo_url ?? project.url} target="_blank" rel="noreferrer" className="project-link">
                                                Voir le projet &rarr;
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
            <br />
        </section>
    );
}

export default Projet;