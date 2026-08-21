import { useEffect, useState } from 'react';
import api, { getCsrfCookie } from '../../services/api';

export default function CreateProjet() {
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('loading');

    const [form, setForm] = useState({
        nom: '',
        description: '',
        project_image: null,
        skills: []
    });
    useEffect(() => {
        api.get('/competences')
            .then((response) => {
                const data = response.data;

                if (Array.isArray(data)) {
                    setSkills(data);
                } else {
                    setSkills([]);
                }
            })
            .catch((err) => {
                console.error(
                    'Erreur lors de la récupération des compétences :',
                    err
                );
            });
    }, []);
    useEffect(() => {
        loadProjects();
    }, []);
    async function loadProjects() {
        try {
            setStatus('loading');
            const response = await api.get('/projects');
            setProjects(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
            setStatus('ready');
        } catch (err) {
            console.error(
                'Erreur lors de la récupération des projets :',
                err
            );
            setStatus('error');
        }
    }
    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }
    function handleFileChange(event) {
        setForm({
            ...form,
            project_image: event.target.files[0] || null
        });
    }
    function handleSkillChange(skillId) {
        const currentSkills = [...form.skills];
        if (currentSkills.includes(skillId)) {
            setForm({
                ...form,
                skills: currentSkills.filter(
                    id => id !== skillId
                )
            });
        } else {
            setForm({
                ...form,
                skills: [
                    ...currentSkills,
                    skillId
                ]
            });
        }
    }
    function resetForm() {

        setForm({
            nom: '',
            description: '',
            project_image: null,
            skills: []
        });
        setEditingProject(null);
        setError('');
    }


    function handleCreateClick() {
        resetForm();
        setShowForm(true);
    }

    function handleEditProject(project) {
        setEditingProject(project);
        setForm({
            nom: project.nom ?? '',
            description: project.description ?? '',
            project_image: null,

            skills: project.skills
                ? project.skills.map(skill => skill.id)
                : []
        });
        setError('');
        setShowForm(true);
    }
    async function handleCreateProject() {
        const formData = new FormData();
        formData.append('nom', form.nom);
        formData.append('description', form.description);
        if (form.project_image) {
            formData.append(
                'project_image',
                form.project_image
            );
        }
        form.skills.forEach(skillId => {
            formData.append(
                'skills[]',
                skillId
            );
        });
        try {
            await getCsrfCookie();
            const response = await api.post(
                '/admin/create/project',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            // Ajouter directement le nouveau projet
            setProjects(currentProjects => [
                ...currentProjects,
                response.data.project
            ]);
            alert('Projet créé avec succès !');
            resetForm();
            setShowForm(false);

        } catch (err) {
            console.error(
                'Erreur lors de la création :',
                err
            );
            setError(
                err.response?.data?.message ||
                'Une erreur est survenue lors de la création.'
            );
        } finally {
            setIsSending(false);
        }
    }
    async function handleUpdateProject() {

        if (!editingProject) {
            return;
        }
        const formData = new FormData();
        formData.append(
            'nom',
            form.nom
        );
        formData.append(
            'description',
            form.description
        );
        if (form.project_image) {

            formData.append(
                'project_image',
                form.project_image
            );
        }
        form.skills.forEach(skillId => {

            formData.append(
                'skills[]',
                skillId
            );
        });
        formData.append(
            '_method',
            'PUT'
        );
        try {
            await getCsrfCookie();
            const response = await api.post(
                `/admin/project/${editingProject.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setProjects(currentProjects =>
                currentProjects.map(project =>
                    project.id === editingProject.id
                        ? response.data.project
                        : project
                )
            );
            alert('Projet modifié avec succès !');
            resetForm();
            setShowForm(false);
        } catch (err) {

            console.error(
                'Erreur lors de la modification :',
                err
            );

            setError(
                err.response?.data?.message ||
                'Une erreur est survenue lors de la modification.'
            );

        } finally {

            setIsSending(false);
        }
    }
    async function handleSubmit(event) {
        event.preventDefault();
        setIsSending(true);
        setError('');
        if (editingProject) {
            await handleUpdateProject();
        } else {
            await handleCreateProject();
        }
    }
    async function handleDeleteProject(projectId) {
        const confirmed = window.confirm(
            'Voulez-vous vraiment supprimer ce projet ? Cette action est irréversible.'
        );
        if (!confirmed) {
            return;
        }
        try {
            await getCsrfCookie();
            await api.delete(
                `/admin/project/${projectId}`
            );
            setProjects(currentProjects =>
                currentProjects.filter(
                    project => project.id !== projectId
                )
            );
            alert('Projet supprimé avec succès !');
        } catch (err) {
            console.error(
                'Erreur lors de la suppression :',
                err
            );
            alert(
                err.response?.data?.message ||
                'Impossible de supprimer le projet.'
            );
        }
    }

    function handleCancelForm() {

        resetForm();

        setShowForm(false);
    }

    return (
        <main className="admin-container" style={{ padding: '24px' }}>
            <section className="projects-section" aria-labelledby="projects-title">

                <div className="section-heading">

                    <div>

                        <p className="eyebrow">
                            Administration
                        </p>

                        <h2 className="projects-title">
                            Mes projets
                        </h2>

                    </div>

                    <span className="project-count">
                        {projects.length
                            .toString()
                            .padStart(2, '0')
                        } projets
                    </span>

                </div>
                {status === 'loading' && (

                    <p className="feedback">
                        Chargement des projets...
                    </p>

                )}
                {status === 'error' && (

                    <p className="feedback feedback-error">
                        Impossible de charger les projets.
                    </p>

                )}
                {status === 'ready' &&
                    projects.length === 0 && (
                        <p className="feedback">
                            Aucun projet publié pour le moment.
                        </p>

                    )
                }


                {projects.length > 0 && (

                    <div className="project-grid">

                        {projects.map((project) => {

                            const title =
                                project.title ??
                                project.nom ??
                                'Projet sans titre';

                            const imagePath =
                                project.image_path ??
                                project.projects_image;

                            const image = imagePath
                                ? `http://localhost:8000${imagePath}`
                                : null;

                            const projectSkills =
                                project.skills ?? [];


                            // Gestion stack JSON
                            let stackItems = [];

                            if (
                                Array.isArray(project.stack)
                            ) {

                                stackItems =
                                    project.stack;

                            } else if (
                                typeof project.stack === 'string'
                            ) {

                                try {

                                    stackItems =
                                        JSON.parse(
                                            project.stack
                                        );

                                } catch {

                                    stackItems =
                                        project.stack
                                            .split(',')
                                            .map(
                                                s => s.trim()
                                            );
                                }
                            }


                            return (

                                <article
                                    className="project-card"
                                    key={project.id}
                                >

                                    {/* IMAGE */}

                                    <div className="project-visual">

                                        {image ? (

                                            <img
                                                src={image}
                                                alt={`Aperçu de ${title}`}
                                            />

                                        ) : (

                                            <span>
                                                PROJET
                                            </span>

                                        )}

                                    </div>


                                    {/* CONTENU */}

                                    <div className="project-content">

                                        <p className="project-index">
                                            {String(project.id)
                                                .padStart(2, '0')
                                            }
                                        </p>

                                        <h3>
                                            {title}
                                        </h3>

                                        <p className="project-description">
                                            {project.description}
                                        </p>


                                        {/* SKILLS */}

                                        <div className="project-footer">

                                            <div className="project-stack-list">

                                                {projectSkills.length > 0 ? (

                                                    projectSkills.map(
                                                        skill => (

                                                            <span
                                                                className="skill-badge"
                                                                key={skill.id}
                                                            >

                                                                {skill.icon_path && (

                                                                    <img
                                                                        src={skill.icon_path}
                                                                        alt=""
                                                                        className="skill-icon"
                                                                    />

                                                                )}

                                                                {skill.name}

                                                            </span>
                                                        )
                                                    )

                                                ) : stackItems.length > 0 ? (

                                                    stackItems.map(
                                                        (tech, index) => (

                                                            <span
                                                                className="skill-badge"
                                                                key={index}
                                                            >
                                                                {tech}
                                                            </span>

                                                        )
                                                    )

                                                ) : (

                                                    <span className="stack-placeholder">
                                                        Stack à venir
                                                    </span>

                                                )}

                                            </div>


                                            {/* LIEN PROJET */}

                                            {(project.demo_url ??
                                                project.url) && (

                                                <a
                                                    href={
                                                        project.demo_url ??
                                                        project.url
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="project-link"
                                                >
                                                    Voir le projet →
                                                </a>

                                            )}

                                        </div>


                                        {/* =================================
                                            ACTIONS
                                        ================================== */}

                                        <div
                                            className="project-actions"
                                            style={{
                                                display: 'flex',
                                                gap: '10px',
                                                marginTop: '20px'
                                            }}
                                        >

                                            <button
                                                type="button"
                                                className="btn-edit"
                                                onClick={() =>
                                                    handleEditProject(
                                                        project
                                                    )
                                                }
                                                style={{
                                                    padding: '9px 16px',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    backgroundColor: '#263d32',
                                                    color: 'white'
                                                }}
                                            >
                                                Modifier
                                            </button>


                                            <button
                                                type="button"
                                                className="btn-delete"
                                                onClick={() =>
                                                    handleDeleteProject(
                                                        project.id
                                                    )
                                                }
                                                style={{
                                                    padding: '9px 16px',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    backgroundColor: '#dc2626',
                                                    color: 'white'
                                                }}
                                            >
                                                Supprimer
                                            </button>

                                        </div>

                                    </div>

                                </article>

                            );
                        })}

                    </div>
                )}

            </section>


            {/* =====================================
                BOUTON AJOUTER
            ====================================== */}

            {!showForm && (

                <div
                    style={{
                        marginTop: '24px',
                        textAlign: 'right'
                    }}
                >

                    <button
                        onClick={handleCreateClick}
                        className="btn-primary"
                        style={{
                            padding: '12px 24px',
                            cursor: 'pointer'
                        }}
                    >
                        + Ajouter un projet
                    </button>

                </div>

            )}


            {/* =====================================
                FORMULAIRE
            ====================================== */}

            {showForm && (

                <section
                    className="form-card"
                    style={{
                        marginTop: '24px',
                        padding: '32px',
                        borderRadius: '12px',
                        background:
                            'var(--card-bg, #ffffff)',
                        boxShadow:
                            '0 4px 20px rgba(0,0,0,0.08)',
                        border:
                            '1px solid var(--border-color, #e2e8f0)'
                    }}
                >

                    {/* TITRE */}

                    <div
                        className="section-heading"
                        style={{
                            marginBottom: '24px'
                        }}
                    >

                        <p
                            className="eyebrow"
                            style={{
                                textTransform: 'uppercase',
                                fontSize: '0.85rem',
                                letterSpacing: '1px',
                                color: '#263d32'
                            }}
                        >
                            Administration
                        </p>

                        <h3
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold'
                            }}
                        >

                            {editingProject
                                ? 'Modifier le projet'
                                : 'Ajouter un nouveau projet'
                            }

                        </h3>

                    </div>


                    {/* ERREUR */}

                    {error && (

                        <p
                            className="feedback-error"
                            style={{
                                color: '#ef4444',
                                marginBottom: '16px',
                                padding: '10px',
                                background: '#fee2e2',
                                borderRadius: '6px'
                            }}
                        >
                            {error}
                        </p>

                    )}
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }}
                    >

                        {/* NOM */}

                        <div className="form-group">

                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '500'
                                }}
                            >
                                Nom du projet :
                            </label>

                            <input
                                type="text"
                                name="nom"
                                value={form.nom}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '6px',
                                    border:
                                        '1px solid #cbd5e1'
                                }}
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="form-group">

                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '500'
                                }}
                            >
                                Description :
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                required
                                rows="4"
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '6px',
                                    border:
                                        '1px solid #cbd5e1'
                                }}
                            />

                        </div>


                        {/* IMAGE */}

                        <div className="form-group">

                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '500'
                                }}
                            >
                                {editingProject
                                    ? 'Nouvelle image (optionnel) :'
                                    : 'Image du projet :'
                                }
                            </label>

                            <input
                                type="file"
                                name="project_image"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    background: '#f8fafc',
                                    borderRadius: '6px',
                                    border:
                                        '1px dashed #cbd5e1'
                                }}
                            />

                            {editingProject &&
                                editingProject.projects_image && (

                                    <p
                                        style={{
                                            marginTop: '8px',
                                            fontSize: '0.85rem',
                                            color: '#64748b'
                                        }}
                                    >
                                        Laissez vide pour conserver
                                        l'image actuelle.
                                    </p>

                                )}

                        </div>


                        {/* COMPÉTENCES */}

                        <div className="form-group">

                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '500'
                                }}
                            >
                                Stack Technique :
                            </label>


                            <div
                                className="skills-selection-container"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    marginTop: '8px',
                                    maxHeight: '250px',
                                    overflowY: 'auto',
                                    padding: '12px',
                                    background: '#f8fafc',
                                    borderRadius: '8px',
                                    border:
                                        '1px solid #e2e8f0'
                                }}
                            >

                                {skills.map(category => (

                                    <div
                                        key={
                                            category.id ??
                                            category.name
                                        }
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '6px'
                                        }}
                                    >

                                        {category.name && (

                                            <span
                                                style={{
                                                    fontSize: '0.85rem',
                                                    fontWeight: 'bold',
                                                    color: '#64748b'
                                                }}
                                            >
                                                {category.name}
                                            </span>

                                        )}


                                        <div
                                            style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '12px',
                                                paddingLeft: '8px'
                                            }}
                                        >

                                            {(category.skills ??
                                                [category]
                                            ).map(skill => (

                                                <label
                                                    key={skill.id}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        cursor: 'pointer',
                                                        background: '#ffffff',
                                                        padding: '6px 10px',
                                                        borderRadius: '6px',
                                                        border:
                                                            '1px solid #e2e8f0'
                                                    }}
                                                >

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            form.skills.includes(
                                                                skill.id
                                                            )
                                                        }
                                                        onChange={() =>
                                                            handleSkillChange(
                                                                skill.id
                                                            )
                                                        }
                                                    />

                                                    <span
                                                        style={{
                                                            fontSize:
                                                                '0.9rem'
                                                        }}
                                                    >
                                                        {skill.name}
                                                    </span>

                                                </label>

                                            ))}

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>


                        {/* =====================================
                            BOUTONS
                        ====================================== */}

                        <div
                            style={{
                                display: 'flex',
                                gap: '12px',
                                marginTop: '10px'
                            }}
                        >

                            <button
                                type="submit"
                                disabled={isSending}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor:
                                        '#263d32',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    cursor:
                                        isSending
                                            ? 'not-allowed'
                                            : 'pointer',
                                    opacity:
                                        isSending
                                            ? 0.7
                                            : 1
                                }}
                            >

                                {isSending
                                    ? 'Envoi en cours...'
                                    : editingProject
                                        ? 'Modifier le projet'
                                        : 'Enregistrer le projet'
                                }

                            </button>


                            <button
                                type="button"
                                onClick={handleCancelForm}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor:
                                        '#e2e8f0',
                                    color: '#334155',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                Annuler
                            </button>

                        </div>

                    </form>

                </section>

            )}

        </main>
    );
}