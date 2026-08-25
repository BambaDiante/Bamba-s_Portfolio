import { useEffect, useState } from 'react';
import {
    Code2,
    Database,
    Globe,
    Server,
    ShieldCheck,
    Smartphone,
    Wrench
} from 'lucide-react';

import api from '../services/api';
import Reveal from './Reveal';

function Competences() {
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        api.get('/competences')
            .then(response => {
                setCategories(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );
                setStatus('ready');
            })
            .catch(error => {
                console.error(
                    "Erreur lors de la récupération des compétences :",
                    error
                );
                setStatus('error');
            });
    }, []);

    const skillCount = categories.reduce(
        (total, category) =>
            total +
            (Array.isArray(category.skills)
                ? category.skills.length
                : 0),
        0
    );

    const getCategoryIcon = (name = '') => {
        const value = name.toLowerCase();

        if (
            value.includes('frontend') ||
            value.includes('web')
        ) {
            return <Globe size={21} />;
        }

        if (
            value.includes('backend') ||
            value.includes('serveur')
        ) {
            return <Server size={21} />;
        }

        if (
            value.includes('base') ||
            value.includes('database') ||
            value.includes('donnée')
        ) {
            return <Database size={21} />;
        }

        if (
            value.includes('mobile')
        ) {
            return <Smartphone size={21} />;
        }

        if (
            value.includes('sécurité') ||
            value.includes('cyber')
        ) {
            return <ShieldCheck size={21} />;
        }

        if (
            value.includes('outil') ||
            value.includes('devops')
        ) {
            return <Wrench size={21} />;
        }

        return <Code2 size={21} />;
    };

    return (
        <section
            className="skills-section"
            aria-labelledby="skills-title"
        >

            <div className="section-heading">

                <h2 id="skills-title">
                    Mes compétences
                </h2>

                <span className="skill-count">
                    {skillCount
                        .toString()
                        .padStart(2, '0')} compétences
                </span>

            </div>

            {status === 'loading' && (
                <p className="feedback">
                    Chargement des compétences...
                </p>
            )}

            {status === 'error' && (
                <p className="feedback feedback-error">
                    Impossible de charger les compétences.
                </p>
            )}

            {status === 'ready' &&
                categories.length === 0 && (
                    <p className="feedback">
                        Aucune compétence publiée pour le moment.
                    </p>
                )}

            {categories.length > 0 && (
                <div className="skills-grid">

                    {categories.map((category, index) => {

                        const categoryName =
                            category.name ??
                            category.nom ??
                            'Compétences';

                        return (
                            <Reveal
                                as="article"
                                className="skills-category"
                                direction="zoom"
                                delay={index * 100}
                                key={category.id}
                            >

                                <div className="skills-category-heading">

                                    <div className="skills-category-icon">
                                        {getCategoryIcon(categoryName)}
                                    </div>

                                    <div>
                                        <span className="skills-category-label">
                                            EXPERTISE
                                        </span>

                                        <h3>
                                            {categoryName}
                                        </h3>
                                    </div>

                                </div>


                                <div className="skills-list">

                                    {(category.skills ?? []).map(
                                        (skill) => (
                                            <span
                                                className="skill-item"
                                                key={skill.id}
                                            >

                                                {skill.icon_path ? (
                                                    <img
                                                        src={skill.icon_path}
                                                        alt=""
                                                        className="skill-item-icon"
                                                    />
                                                ) : (
                                                    <Code2
                                                        size={15}
                                                    />
                                                )}

                                                <span>
                                                    {skill.name}
                                                </span>

                                            </span>
                                        )
                                    )}

                                </div>

                            </Reveal>
                        );
                    })}

                </div>
            )}

        </section>
    );
}

export default Competences;