import { useEffect, useState } from 'react';
import api from '../services/api';

function Competences() {
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState('loading');

    useEffect(()=>{
        api.get('/competences')
            .then(response => {
                setCategories(Array.isArray(response.data) ? response.data : []);
                setStatus('ready');
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des compétences :", error);
                setStatus('error');
            });
    }, []);

    const skillCount = categories.reduce(
        (total, category) => total + (Array.isArray(category.skills) ? category.skills.length : 0),
        0,
    );

    return (
        <section className="skills-section" aria-labelledby="skills-title">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Boîte à outils</p>
                    <h2 id="skills-title">Mes compétences</h2>
                </div>
                <span className="project-count">{skillCount.toString().padStart(2, '0')} compétences</span>
            </div>

            {status === 'loading' && <p className="feedback">Chargement des compétences...</p>}
            {status === 'error' && <p className="feedback feedback-error">Impossible de charger les compétences.</p>}
            {status === 'ready' && categories.length === 0 && (
                <p className="feedback">Aucune compétence publiée pour le moment.</p>
            )}

            {categories.length > 0 && (
                <div className="skills-grid">
                    {categories.map((category) => (
                        <article className="skills-category" key={category.id}>
                            <div className="skills-category-heading">
                                <span className="skill-category-icon">{category.icone || category.icon_path ? '✦' : '//'}</span>
                                <h3>{category.name ?? category.nom ?? 'Compétences'}</h3>
                            </div>
                            <ul className="skills-list">
                                {(category.skills ?? []).map((skill) => (
                                    <li key={skill.id}>
                                        {skill.icon_path && <img src={skill.icon_path} alt="" />}
                                        <span>{skill.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default Competences;