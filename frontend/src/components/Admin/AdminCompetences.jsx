import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Pencil, Trash2 } from 'lucide-react';

export default function CompetencesAdmin() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');

    const [showSkillModal, setShowSkillModal] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [skillForm, setSkillForm] = useState({ name: '', category_id: '', icon_path: '' });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/competences');
            setCategories(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Erreur lors du chargement des compétences :', err);
            setError('Impossible de charger les compétences.');
        } finally {
            setLoading(false);
        }
    }

    function openCreateCategory() {
        setEditingCategory(null);
        setCategoryName('');
        setError('');
        setShowCategoryModal(true);
    }

    function openEditCategory(category) {
        setEditingCategory(category);
        setCategoryName(category.nom);
        setError('');
        setShowCategoryModal(true);
    }

    function closeCategoryModal() {
        setShowCategoryModal(false);
        setEditingCategory(null);
        setCategoryName('');
        setError('');
    }

    async function handleCategorySubmit(event) {
        event.preventDefault();
        if (!categoryName.trim()) return;

        setIsSubmitting(true);
        setError('');

        try {
            // await getCsrfCookie();

            if (editingCategory) {
                const response = await api.put(`/admin/category/${editingCategory.id}`, {
                    category: categoryName
                });
                setCategories(currentCategories =>
                    currentCategories.map(category =>
                        category.id === editingCategory.id
                            ? { ...category, ...response.data.category }
                            : category
                    )
                );
            } else {
                const response = await api.post('/admin/create/category', { category: categoryName });
                setCategories(currentCategories => [
                    ...currentCategories,
                    { ...response.data.category, skills: [] }
                ]);
            }

            closeCategoryModal();
        } catch (err) {
            console.error('Erreur catégorie :', err);
            setError(err.response?.data?.message || 'Une erreur est survenue.');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDeleteCategory(category) {
        const confirmed = window.confirm(
            `Supprimer la catégorie "${category.nom}" ?\n\nToutes les compétences de cette catégorie seront également supprimées.`
        );
        if (!confirmed) return;

        try {
            // await getCsrfCookie();
            await api.delete(`/admin/category/${category.id}`);
            setCategories(currentCategories =>
                currentCategories.filter(item => item.id !== category.id)
            );
        } catch (err) {
            console.error('Erreur suppression catégorie :', err);
            alert(err.response?.data?.message || 'Impossible de supprimer la catégorie.');
        }
    }

    function openCreateSkill(categoryId = '') {
        setEditingSkill(null);
        setSkillForm({ name: '', category_id: categoryId, icon_path: '' });
        setError('');
        setShowSkillModal(true);
    }

    function openEditSkill(skill) {
        setEditingSkill(skill);
        setSkillForm({
            name: skill.name ?? '',
            category_id: skill.category_id ?? '',
            icon_path: skill.icon_path ?? ''
        });
        setError('');
        setShowSkillModal(true);
    }

    function closeSkillModal() {
        setShowSkillModal(false);
        setEditingSkill(null);
        setSkillForm({ name: '', category_id: '', icon_path: '' });
        setError('');
    }

    function handleSkillChange(event) {
        const { name, value } = event.target;
        setSkillForm(currentForm => ({ ...currentForm, [name]: value }));
    }

    async function handleSkillSubmit(event) {
        event.preventDefault();

        if (!skillForm.name.trim()) return;
        if (!skillForm.category_id) {
            setError('Veuillez sélectionner une catégorie.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // await getCsrfCookie();

            if (editingSkill) {
                const response = await api.put(`/admin/skill/${editingSkill.id}`, skillForm);
                const updatedSkill = response.data.skill;

                setCategories(currentCategories =>
                    currentCategories.map(category => {
                        const oldCategoryContainsSkill = category.skills?.some(
                            skill => skill.id === editingSkill.id
                        );
                        const isNewCategory = category.id == updatedSkill.category_id;

                        let newSkills = category.skills ?? [];

                        if (oldCategoryContainsSkill) {
                            newSkills = newSkills.filter(skill => skill.id !== updatedSkill.id);
                        }
                        if (isNewCategory) {
                            newSkills = [...newSkills, updatedSkill];
                        }

                        return { ...category, skills: newSkills };
                    })
                );
            } else {
                const response = await api.post('/admin/create/skill', skillForm);
                const newSkill = response.data.skill;

                setCategories(currentCategories =>
                    currentCategories.map(category =>
                        category.id == newSkill.category_id
                            ? { ...category, skills: [...(category.skills ?? []), newSkill] }
                            : category
                    )
                );
            }

            closeSkillModal();
        } catch (err) {
            console.error('Erreur compétence :', err);
            setError(err.response?.data?.message || 'Une erreur est survenue.');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDeleteSkill(skill) {
        const confirmed = window.confirm(`Supprimer la compétence "${skill.name}" ?`);
        if (!confirmed) return;

        try {
            // await getCsrfCookie();
            await api.delete(`/admin/skill/${skill.id}`);
            setCategories(currentCategories =>
                currentCategories.map(category => ({
                    ...category,
                    skills: (category.skills ?? []).filter(item => item.id !== skill.id)
                }))
            );
        } catch (err) {
            console.error('Erreur suppression compétence :', err);
            alert(err.response?.data?.message || 'Impossible de supprimer la compétence.');
        }
    }

    if (loading) {
        return <p className="feedback">Chargement des compétences...</p>;
    }

    return (
        <section className="skills-section">
            <div className="section-heading">
                <div>
                    <h2 className="projects-title">Compétences</h2>
                </div>
                <button type="button" onClick={openCreateCategory} className="btn btn-primary">
                    + Ajouter une catégorie
                </button>
            </div>

            {error && !showCategoryModal && !showSkillModal && (
                <p className="form-message form-error">{error}</p>
            )}

            {categories.length === 0 && (
                <div className="empty-state">
                    <h3>Aucune catégorie</h3>
                    <p>Commence par créer ta première catégorie.</p>
                    <button type="button" onClick={openCreateCategory} className="btn btn-primary">
                        Créer une catégorie
                    </button>
                </div>
            )}

            <div className="categories-grid">
                {categories.map(category => (
                    <article className="category-card" key={category.id}>
                        <div className="category-card-header">
                            <div>
                                <h3>{category.nom}</h3>
                                <span className="category-count">
                                    {category.skills?.length ?? 0} compétence
                                    {(category.skills?.length ?? 0) !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="category-card-actions">
                                <button
                                    type="button"
                                    title="Modifier la catégorie"
                                    onClick={() => openEditCategory(category)}
                                    className="icon-button edit-button"
                                    aria-label={`Modifier ${category.nom}`}
                                >
                                    <Pencil size={17} strokeWidth={2} />
                                </button>
                                <button
                                    type="button"
                                    title="Supprimer la catégorie"
                                    onClick={() => handleDeleteCategory(category)}
                                    className="icon-button delete-button"
                                    aria-label={`Supprimer ${category.nom}`}
                                >
                                    <Trash2 size={17} strokeWidth={2} />
                                </button>
                            </div>
                        </div>

                        <div className="category-body">
                            {(!category.skills || category.skills.length === 0) && (
                                <p className="empty-skills">Aucune compétence.</p>
                            )}

                            <div className="skills-list-admin">
                                {category.skills?.map(skill => (
                                    <div className="skill-row" key={skill.id}>
                                        <div className="skill-row-info">
                                            {skill.icon_path && (
                                                <img src={skill.icon_path} alt="" className="skill-row-icon" />
                                            )}
                                            <span className="skill-row-name">{skill.name}</span>
                                        </div>
                                        <div className="skill-row-actions">
                                            <button
                                                type="button"
                                                title="Modifier"
                                                onClick={() => openEditSkill(skill)}
                                                className="icon-button edit-button"
                                                aria-label={`Modifier ${skill.name}`}
                                            >
                                                <Pencil size={16} strokeWidth={2} />
                                            </button>
                                            <button
                                                type="button"
                                                title="Supprimer"
                                                onClick={() => handleDeleteSkill(skill)}
                                                className="icon-button delete-button"
                                                aria-label={`Supprimer ${skill.name}`}
                                            >
                                                <Trash2 size={16} strokeWidth={2} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => openCreateSkill(category.id)}
                                className="btn-add-skill"
                            >
                                + Ajouter une compétence
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            {showCategoryModal && (
                <div className="modal-overlay" onClick={closeCategoryModal}>
                    <div className="modal-card" onClick={event => event.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h3>
                            <button type="button" onClick={closeCategoryModal} className="modal-close">×</button>
                        </div>

                        {error && <p className="form-message form-error">{error}</p>}

                        <form onSubmit={handleCategorySubmit} className="form-fields">
                            <div className="form-field">
                                <label>Nom de la catégorie</label>
                                <input
                                    type="text"
                                    value={categoryName}
                                    onChange={event => setCategoryName(event.target.value)}
                                    placeholder="Ex : Frontend"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={closeCategoryModal} className="btn btn-secondary">
                                    Annuler
                                </button>
                                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                    {isSubmitting ? 'Enregistrement...' : editingCategory ? 'Modifier' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showSkillModal && (
                <div className="modal-overlay" onClick={closeSkillModal}>
                    <div className="modal-card" onClick={event => event.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingSkill ? 'Modifier la compétence' : 'Nouvelle compétence'}</h3>
                            <button type="button" onClick={closeSkillModal} className="modal-close">×</button>
                        </div>

                        {error && <p className="form-message form-error">{error}</p>}

                        <form onSubmit={handleSkillSubmit} className="form-fields">
                            <div className="form-field">
                                <label>Nom</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={skillForm.name}
                                    onChange={handleSkillChange}
                                    placeholder="Ex : React"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="form-field">
                                <label>Catégorie</label>
                                <select
                                    name="category_id"
                                    value={skillForm.category_id}
                                    onChange={handleSkillChange}
                                    required
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Icône</label>
                                <input
                                    type="text"
                                    name="icon_path"
                                    value={skillForm.icon_path}
                                    onChange={handleSkillChange}
                                    placeholder="Ex : /icons/react.svg"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={closeSkillModal} className="btn btn-secondary">
                                    Annuler
                                </button>
                                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                    {isSubmitting ? 'Enregistrement...' : editingSkill ? 'Modifier' : 'Ajouter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
