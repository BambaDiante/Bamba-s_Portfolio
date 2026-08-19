import { useEffect, useState } from 'react';
import api from '../services/api';

function Parcours(){
    const [parcours, setparcours] = useState([]);
    const [status, setStatus] = useState('loading');


    useEffect(() => {
        api.get('/parcours')
            .then(response => {
                setparcours(Array.isArray(response.data) ? response.data : []);
                setStatus('ready');
            })
            .catch(error => {
                console.error("Erreur lors de la récupération du parcours :", error);
                setStatus('error');
            });
    }, []);
    return (
            <section>
                <h2>Experience</h2>
                <br />
                {status === 'loading' && <p>Chargement du parcours...</p>}
                {status === 'error' && <p>Impossible de charger le parcours.</p>}
                {status === 'ready' && parcours.length === 0 && (
                    <p>Aucune expérience disponible pour le moment.</p>
                )}

                {parcours.map((experience) => (
                    <article key={experience.id}>
                        <h3>Institut: {experience.Institut}</h3>
                        <h3>Description</h3>
                        <p>{experience.description}</p>
                        <h3>Duree: {experience.duree}</h3>
                    </article>
                ))}
            </section>
        )
}

export default Parcours;