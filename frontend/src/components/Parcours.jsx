import { useEffect, useState } from 'react';
import { Clock3, GraduationCap } from 'lucide-react';
import api from '../services/api';

console.log("NOUVEAU PARCOURS CHARGE");

function Parcours() {
    const [parcours, setParcours] = useState([]);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        api.get('/parcours')
            .then(response => {
                setParcours(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );
                setStatus('ready');
            })
            .catch(error => {
                console.error(
                    "Erreur lors de la récupération du parcours :",
                    error
                );
                setStatus('error');
            });
    }, []);

    return (
        <section className="parcours-section">
            <h2>Experience</h2>
            {status === 'loading' && (
                <p>Chargement du parcours...</p>
            )}
            {status === 'error' && (
                <p>Impossible de charger le parcours.</p>
            )}
            {status === 'ready' && parcours.length === 0 && (
                <p>Aucune expérience disponible pour le moment.</p>
            )}
            <div className="parcours-list">
                {parcours.map((experience) => (
                    <article
                        key={experience.id}
                        className="parcours-card"
                    >
                        <div className="parcours-card-header">
                            <div className="parcours-icon">
                                <GraduationCap size={22} />
                            </div>
                            <div className="parcours-duration">
                                <Clock3 size={15} />
                                <span>
                                    {experience.duree}
                                </span>
                            </div>
                        </div>
                        <div className="parcours-content">
                            <span className="parcours-label">
                                FORMATION
                            </span>
                            <h3>
                                {experience.Institut}
                            </h3>
                            <p className="parcours-description">
                                {experience.description}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
            <br />
        </section>
    );
}

export default Parcours;