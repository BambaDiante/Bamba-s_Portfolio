import { useEffect, useState } from 'react';
import api,{ getCsrfCookie } from '../../services/api';

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
                setSkills(Array.isArray(response.data) ? response.data : []);
            })
            .catch((err) => {
                console.error('Erreur lors de la récupération des compétences :', err);
            });
    }, []);

    useEffect(() => {
        loadProjects();
    }, []);

    async function loadProjects() {
        try {
            setStatus('loading');
            const response = await api.get('/projects');
            setProjects(Array.isArray(response.data) ? response.data : []);
            setStatus('ready');
        } catch (err) {
            console.error('Erreur lors de la récupération des projets :', err);
            setStatus('error');
        }
    }

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    function handleFileChange(event) {
        setForm({ ...form, project_image: event.target.files[0] || null });
    }

    function handleSkillChange(skillId) {
        const currentSkills = [...form.skills];
        if (currentSkills.includes(skillId)) {
            setForm({ ...form, skills: currentSkills.filter(id => id !== skillId) });
        } else {
            setForm({ ...form, skills: [...currentSkills, skillId] });
        }
    }

    function resetForm() {
        setForm({ nom: '', description: '', project_image: null, skills: [] });
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
            skills: project.skills ? project.skills.map(skill => skill.id) : []
        });
        setError('');
        setShowForm(true);
    }

    async function handleCreateProject() {
        const formData = new FormData();
        formData.append('nom', form.nom);
        formData.append('description', form.description);
        if (form.project_image) {
            formData.append('project_image', form.project_image);
        }
        form.skills.forEach(skillId => formData.append('skills[]', skillId));

        try {
            await getCsrfCookie();
            const response = await api.post('/admin/create/project', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProjects(currentProjects => [...currentProjects, response.data.project]);
            alert('Projet créé avec succès !');
            resetForm();
            setShowForm(false);
        } catch (err) {
            console.error('Erreur lors de la création :', err);
            setError(err.response?.data?.message || 'Une erreur est survenue lors de la création.');
        } finally {
            setIsSending(false);
        }
    }

    async function handleUpdateProject() {
        if (!editingProject) return;

        const formData = new FormData();
        formData.append('nom', form.nom);
        formData.append('description', form.description);
        if (form.project_image) {
            formData.append('project_image', form.project_image);
        }
        form.skills.forEach(skillId => formData.append('skills[]', skillId));
        formData.append('_method', 'PUT');

        try {
            await getCsrfCookie();
            const response = await api.post(`/admin/project/${editingProject.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProjects(currentProjects =>
                currentProjects.map(project =>
                    project.id === editingProject.id ? response.data.project : project
                )
            );
            alert('Projet modifié avec succès !');
            resetForm();
            setShowForm(false);
        } catch (err) {
            console.error('Erreur lors de la modification :', err);
            setError(err.response?.data?.message || 'Une erreur est survenue lors de la modification.');
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
        const confirmed = window.confirm('Voulez-vous vraiment supprimer ce projet ? Cette action est irréversible.');
        if (!confirmed) return;

        try {
            await getCsrfCookie();
            await api.delete(`/admin/project/${projectId}`);
            setProjects(currentProjects => currentProjects.filter(project => project.id !== projectId));
            alert('Projet supprimé avec succès !');
        } catch (err) {
            console.error('Erreur lors de la suppression :', err);
            alert(err.response?.data?.message || 'Impossible de supprimer le projet.');
        }
    }

    function handleCancelForm() {
        resetForm();
        setShowForm(false);
    }

    return (
        <section className="projects-section" aria-labelledby="projects-title">
            <div className="section-heading">
                <div>
                    <h2 className="projects-title">Mes projets</h2>
                </div>
                <span className="project-count">
                    {projects.length.toString().padStart(2, '0')} projets
                </span>
            </div>

            {status === 'loading' && <p className="feedback">Chargement des projets...</p>}
            {status === 'error' && <p className="feedback form-error">Impossible de charger les projets.</p>}
            {status === 'ready' && projects.length === 0 && (
                <p className="feedback">Aucun projet publié pour le moment.</p>
            )}

            {projects.length > 0 && (
                <div className="project-grid">
                    {projects.map((project) => {
                        const title = project.title ?? project.nom ?? 'Projet sans titre';
                        const image = project.image_path ?? project.projects_image ?? null;
                        const projectSkills = project.skills ?? [];

                        let stackItems = [];
                        if (Array.isArray(project.stack)) {
                            stackItems = project.stack;
                        } else if (typeof project.stack === 'string') {
                            try {
                                stackItems = JSON.parse(project.stack);
                            } catch {
                                stackItems = project.stack.split(',').map(s => s.trim());
                            }
                        }

                        return (
                            <article className="project-card" key={project.id}>
                                <div className="project-visual">
                                    {image ? (
                                        <img src={image} alt={`Aperçu de ${title}`} />
                                    ) : (
                                        <span>PROJET</span>
                                    )}
                                </div>

                                <div className="project-content">
                                    <p className="project-index">{String(project.id).padStart(2, '0')}</p>
                                    <h3>{title}</h3>
                                    <p className="project-description">{project.description}</p>

                                    <div className="project-footer">
                                        <div className="project-stack-list">
                                            {projectSkills.length > 0 ? (
                                                projectSkills.map(skill => (
                                                    <span className="skill-badge" key={skill.id}>
                                                        {skill.icon_path && (
                                                            <img src={skill.icon_path} alt="" className="skill-icon" />
                                                        )}
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
                                            <a
                                                href={project.demo_url ?? project.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="project-link"
                                            >
                                                Voir le projet →
                                            </a>
                                        )}
                                    </div>

                                    <div className="project-actions">
                                        <button
                                            type="button"
                                            className="btn btn-contact btn-sm"
                                            onClick={() => handleEditProject(project)}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteProject(project.id)}
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

            {!showForm && (
                <div className="form-actions">
                    <button onClick={handleCreateClick} className="btn btn-primary">
                        + Ajouter un projet
                    </button>
                </div>
            )}

            {showForm && (
                <section className="form-card" style={{ marginTop: '24px' }}>
                    <div className="section-heading" style={{ marginBottom: '24px' }}>
                        <div>
                            <p className="eyebrow">Administration</p>
                            <h3>{editingProject ? 'Modifier le projet' : 'Ajouter un nouveau projet'}</h3>
                        </div>
                    </div>

                    {error && <p className="form-message form-error">{error}</p>}

                    <form onSubmit={handleSubmit} className="form-fields">
                        <div className="form-field">
                            <label>Nom du projet</label>
                            <input
                                type="text"
                                name="nom"
                                value={form.nom}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                required
                                rows="4"
                            />
                        </div>

                        <div className="form-field">
                            <label>
                                {editingProject ? 'Nouvelle image (optionnel)' : 'Image du projet'}
                            </label>
                            <input
                                type="file"
                                name="project_image"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {editingProject && editingProject.projects_image && (
                                <p className="field-hint">Laissez vide pour conserver l'image actuelle.</p>
                            )}
                        </div>

                        <div className="form-field">
                            <label>Stack technique</label>
                            <div className="skills-picker">
                                {skills.map(category => (
                                    <div className="skills-picker-group" key={category.id ?? category.name}>
                                        {category.name && (
                                            <span className="skills-picker-group-label">{category.name}</span>
                                        )}
                                        <div className="skills-picker-options">
                                            {(category.skills ?? [category]).map(skill => (
                                                <label className="skill-checkbox" key={skill.id}>
                                                    <input
                                                        type="checkbox"
                                                        checked={form.skills.includes(skill.id)}
                                                        onChange={() => handleSkillChange(skill.id)}
                                                    />
                                                    <span>{skill.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={handleCancelForm}>
                                Annuler
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={isSending}>
                                {isSending
                                    ? 'Envoi en cours...'
                                    : editingProject
                                        ? 'Modifier le projet'
                                        : 'Enregistrer le projet'}
                            </button>
                        </div>
                    </form>
                </section>
            )}
        </section>
    );
}
