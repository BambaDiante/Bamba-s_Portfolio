import { useEffect, useState } from 'react';
import api, { getCsrfCookie } from '../../services/api';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

export default function CompetencesAdmin() {

    // ==========================================
    // ÉTATS
    // ==========================================

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    // Modal catégorie
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    const [editingCategory, setEditingCategory] = useState(null);

    const [categoryName, setCategoryName] = useState('');

    // Modal skill
    const [showSkillModal, setShowSkillModal] = useState(false);

    const [editingSkill, setEditingSkill] = useState(null);

    const [skillForm, setSkillForm] = useState({
        name: '',
        category_id: '',
        icon_path: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);


    // ==========================================
    // CHARGER LES CATÉGORIES
    // ==========================================

    useEffect(() => {
        loadCategories();
    }, []);


    async function loadCategories() {

        try {

            setLoading(true);
            setError('');

            const response = await api.get('/competences');

            setCategories(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                'Erreur lors du chargement des compétences :',
                err
            );

            setError(
                'Impossible de charger les compétences.'
            );

        } finally {

            setLoading(false);
        }
    }


    // ==========================================
    // CATÉGORIE : OUVRIR CRÉATION
    // ==========================================

    function openCreateCategory() {

        setEditingCategory(null);

        setCategoryName('');

        setError('');

        setShowCategoryModal(true);
    }


    // ==========================================
    // CATÉGORIE : OUVRIR MODIFICATION
    // ==========================================

    function openEditCategory(category) {

        setEditingCategory(category);

        setCategoryName(category.nom);

        setError('');

        setShowCategoryModal(true);
    }


    // ==========================================
    // CATÉGORIE : FERMER MODAL
    // ==========================================

    function closeCategoryModal() {

        setShowCategoryModal(false);

        setEditingCategory(null);

        setCategoryName('');

        setError('');
    }


    // ==========================================
    // CATÉGORIE : CRÉER / MODIFIER
    // ==========================================

    async function handleCategorySubmit(event) {

        event.preventDefault();

        if (!categoryName.trim()) {
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {

            await getCsrfCookie();

            if (editingCategory) {

                // ==========================
                // MODIFICATION
                // ==========================

                const response = await api.put(
                    `/admin/category/${editingCategory.id}`,
                    {
                        category: categoryName
                    }
                );

                setCategories(currentCategories =>
                    currentCategories.map(category =>
                        category.id === editingCategory.id
                            ? {
                                ...category,
                                ...response.data.category
                            }
                            : category
                    )
                );

            } else {

                // ==========================
                // CRÉATION
                // ==========================

                const response = await api.post(
                    '/admin/create/category',
                    {
                        category: categoryName
                    }
                );

                setCategories(currentCategories => [
                    ...currentCategories,
                    {
                        ...response.data.category,
                        skills: []
                    }
                ]);
            }

            closeCategoryModal();

        } catch (err) {

            console.error(
                'Erreur catégorie :',
                err
            );

            setError(
                err.response?.data?.message ||
                'Une erreur est survenue.'
            );

        } finally {

            setIsSubmitting(false);
        }
    }


    // ==========================================
    // CATÉGORIE : SUPPRIMER
    // ==========================================

    async function handleDeleteCategory(category) {

        const confirmed = window.confirm(
            `Supprimer la catégorie "${category.nom}" ?\n\n` +
            `Toutes les compétences de cette catégorie seront également supprimées.`
        );

        if (!confirmed) {
            return;
        }

        try {

            await getCsrfCookie();

            await api.delete(
                `/admin/category/${category.id}`
            );

            setCategories(currentCategories =>
                currentCategories.filter(
                    item => item.id !== category.id
                )
            );

        } catch (err) {

            console.error(
                'Erreur suppression catégorie :',
                err
            );

            alert(
                err.response?.data?.message ||
                'Impossible de supprimer la catégorie.'
            );
        }
    }


    // ==========================================
    // SKILL : OUVRIR CRÉATION
    // ==========================================

    function openCreateSkill(categoryId = '') {

        setEditingSkill(null);

        setSkillForm({
            name: '',
            category_id: categoryId,
            icon_path: ''
        });

        setError('');

        setShowSkillModal(true);
    }


    // ==========================================
    // SKILL : OUVRIR MODIFICATION
    // ==========================================

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


    // ==========================================
    // SKILL : FERMER MODAL
    // ==========================================

    function closeSkillModal() {

        setShowSkillModal(false);

        setEditingSkill(null);

        setSkillForm({
            name: '',
            category_id: '',
            icon_path: ''
        });

        setError('');
    }


    // ==========================================
    // SKILL : CHANGER CHAMP
    // ==========================================

    function handleSkillChange(event) {

        const {
            name,
            value
        } = event.target;

        setSkillForm(currentForm => ({
            ...currentForm,
            [name]: value
        }));
    }


    // ==========================================
    // SKILL : CRÉER / MODIFIER
    // ==========================================

    async function handleSkillSubmit(event) {

        event.preventDefault();

        if (!skillForm.name.trim()) {
            return;
        }

        if (!skillForm.category_id) {
            setError(
                'Veuillez sélectionner une catégorie.'
            );

            return;
        }

        setIsSubmitting(true);
        setError('');

        try {

            await getCsrfCookie();

            if (editingSkill) {

                // ==========================
                // MODIFICATION
                // ==========================

                const response = await api.put(
                    `/admin/skill/${editingSkill.id}`,
                    skillForm
                );

                const updatedSkill =
                    response.data.skill;

                setCategories(currentCategories =>
                    currentCategories.map(category => {

                        // L'ancien parent
                        const oldCategoryContainsSkill =
                            category.skills?.some(
                                skill =>
                                    skill.id === editingSkill.id
                            );

                        // La nouvelle catégorie
                        const isNewCategory =
                            category.id ==
                            updatedSkill.category_id;

                        let newSkills =
                            category.skills ?? [];

                        // Retirer de l'ancienne catégorie
                        if (oldCategoryContainsSkill) {

                            newSkills = newSkills.filter(
                                skill =>
                                    skill.id !== updatedSkill.id
                            );
                        }

                        // Ajouter à la nouvelle catégorie
                        if (isNewCategory) {

                            newSkills = [
                                ...newSkills,
                                updatedSkill
                            ];
                        }

                        return {
                            ...category,
                            skills: newSkills
                        };
                    })
                );

            } else {

                // ==========================
                // CRÉATION
                // ==========================

                const response = await api.post(
                    '/admin/create/skill',
                    skillForm
                );

                const newSkill =
                    response.data.skill;

                setCategories(currentCategories =>
                    currentCategories.map(category =>
                        category.id ==
                        newSkill.category_id

                            ? {
                                ...category,
                                skills: [
                                    ...(category.skills ?? []),
                                    newSkill
                                ]
                            }

                            : category
                    )
                );
            }

            closeSkillModal();

        } catch (err) {

            console.error(
                'Erreur compétence :',
                err
            );

            setError(
                err.response?.data?.message ||
                'Une erreur est survenue.'
            );

        } finally {

            setIsSubmitting(false);
        }
    }


    // ==========================================
    // SKILL : SUPPRIMER
    // ==========================================

    async function handleDeleteSkill(skill) {

        const confirmed = window.confirm(
            `Supprimer la compétence "${skill.name}" ?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await getCsrfCookie();

            await api.delete(
                `/admin/skill/${skill.id}`
            );

            setCategories(currentCategories =>
                currentCategories.map(category => ({
                    ...category,

                    skills: (category.skills ?? [])
                        .filter(
                            item => item.id !== skill.id
                        )
                }))
            );

        } catch (err) {

            console.error(
                'Erreur suppression compétence :',
                err
            );

            alert(
                err.response?.data?.message ||
                'Impossible de supprimer la compétence.'
            );
        }
    }


    // ==========================================
    // CHARGEMENT
    // ==========================================

    if (loading) {

        return (
            <main className="admin-page">

                <p className="feedback">
                    Chargement des compétences...
                </p>

            </main>
        );
    }


    // ==========================================
    // AFFICHAGE
    // ==========================================

    return (

        <main
            className="admin-page"
            style={{
                padding: '32px'
            }}
        >

            {/* =====================================
                HEADER
            ====================================== */}

            <header
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '32px',
                    gap: '20px'
                }}
            >

                <div>
                    <h2>
                        Compétences
                    </h2>

                    <p style={{
                            color: '#64748b',
                            marginTop: '6px'
                        }}
                    >
                        Gère tes catégories et tes
                        compétences.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={openCreateCategory}
                    style={{
                        border: 'none',
                        borderRadius: '8px',
                        padding: '11px 18px',
                        background: '#263d32',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    + Ajouter une catégorie
                </button>

            </header>


            {/* =====================================
                ERREUR GÉNÉRALE
            ====================================== */}

            {error && !showCategoryModal && !showSkillModal && (

                <div
                    style={{
                        padding: '12px 16px',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        borderRadius: '8px',
                        marginBottom: '20px'
                    }}
                >
                    {error}
                </div>

            )}
            {categories.length === 0 && (

                <div
                    style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        border: '1px dashed #cbd5e1',
                        borderRadius: '12px',
                        color: '#64748b'
                    }}
                >
                    <h2>
                        Aucune catégorie
                    </h2>
                    <p>
                        Commence par créer ta première
                        catégorie.
                    </p>
                    <button
                        type="button"
                        onClick={openCreateCategory}
                        style={{
                            marginTop: '16px',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 18px',
                            background: '#263d32',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        Créer une catégorie
                    </button>

                </div>
            )}
            <section
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '20px'
                }}
            >
                {categories.map(category => (
                    <article
                        key={category.id}
                        style={{
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={{
                                padding: '18px 20px',
                                borderBottom:
                                    '1px solid #e2e8f0',
                                display: 'flex',
                                justifyContent:
                                    'space-between',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <div>
                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {category.nom}
                                </h2>
                                <span
                                    style={{
                                        color: '#94a3b8',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {category.skills?.length ?? 0}
                                    {' '}
                                    compétence
                                    {(category.skills?.length ?? 0) !== 1
                                        ? 's'
                                        : ''
                                    }
                                </span>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '6px'
                                }}
                            >
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
                        {/* =========================
                            SKILLS
                        ========================== */}
                        <div
                            style={{
                                padding: '14px'
                            }}
                        >
                            {(!category.skills ||
                                category.skills.length === 0) && (
                                <p
                                    style={{
                                        color: '#94a3b8',
                                        fontSize: '0.9rem',
                                        padding: '8px'
                                    }}
                                >
                                    Aucune compétence.
                                </p>

                            )}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px'
                                }}
                            >
                                {category.skills?.map(skill => (
                                    <div
                                        key={skill.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent:
                                                'space-between',
                                            gap: '10px',
                                            padding:
                                                '10px 12px',
                                            background:
                                                '#f8fafc',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems:
                                                    'center',
                                                gap: '10px',
                                                minWidth: 0
                                            }}
                                        >
                                            {skill.icon_path && (
                                                <img
                                                    src={
                                                        skill.icon_path
                                                    }
                                                    alt=""
                                                    style={{
                                                        width: '28px',
                                                        height: '28px',
                                                        objectFit:
                                                            'contain'
                                                    }}
                                                />

                                            )}
                                            <span
                                                style={{
                                                    fontWeight:
                                                        '500',
                                                    overflow:
                                                        'hidden',
                                                    textOverflow:
                                                        'ellipsis'
                                                }}
                                            >
                                                {skill.name}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: '4px',
                                                flexShrink: 0
                                            }}
                                        >
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
                                onClick={() =>
                                    openCreateSkill(
                                        category.id
                                    )
                                }
                                style={{
                                    width: '100%',
                                    marginTop: '12px',
                                    padding: '9px',
                                    border:
                                        '1px dashed #cbd5e1',
                                    borderRadius: '7px',
                                    background:
                                        'transparent',
                                    color: '#475569',
                                    cursor: 'pointer'
                                }}
                            >
                                + Ajouter une compétence
                            </button>
                        </div>
                    </article>
                ))}
            </section>
            {showCategoryModal && (
                <div
                    onClick={closeCategoryModal}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background:
                            'rgba(15, 23, 42, 0.55)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        zIndex: 1000
                    }}
                >
                    <div
                        onClick={event =>
                            event.stopPropagation()
                        }
                        style={{
                            width: '100%',
                            maxWidth: '440px',
                            background: 'white',
                            borderRadius: '12px',
                            padding: '24px',
                            boxShadow:
                                '0 20px 50px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent:
                                    'space-between',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}
                        >
                            <h2>
                                {editingCategory
                                    ? 'Modifier la catégorie'
                                    : 'Nouvelle catégorie'
                                }
                            </h2>
                            <button
                                type="button"
                                onClick={closeCategoryModal}
                                style={{
                                    border: 'none',
                                    background:
                                        'transparent',
                                    fontSize: '1.3rem',
                                    cursor: 'pointer'
                                }}
                            >
                                ×
                            </button>
                        </div>
                        {error && (
                            <p
                                style={{
                                    color: '#b91c1c',
                                    background:
                                        '#fee2e2',
                                    padding: '10px',
                                    borderRadius: '6px'
                                }}
                            >
                                {error}
                            </p>

                        )}
                        <form onSubmit={handleCategorySubmit}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '7px',
                                    fontWeight: '500'
                                }}
                            >
                                Nom de la catégorie
                            </label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={event =>
                                    setCategoryName(
                                        event.target.value
                                    )
                                }
                                placeholder="Ex : Frontend"
                                required
                                autoFocus
                                style={{
                                    width: '100%',
                                    boxSizing:
                                        'border-box',
                                    padding:
                                        '11px 12px',
                                    border:
                                        '1px solid #cbd5e1',
                                    borderRadius: '7px'
                                }}
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent:
                                        'flex-end',
                                    gap: '10px',
                                    marginTop: '20px'
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={
                                        closeCategoryModal
                                    }
                                    style={{
                                        border: 'none',
                                        padding:
                                            '10px 16px',
                                        borderRadius: '7px',
                                        cursor:
                                            'pointer'
                                    }}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        isSubmitting
                                    }
                                    style={{
                                        border: 'none',
                                        padding:
                                            '10px 16px',
                                        borderRadius: '7px',
                                        background:
                                            '#263d32',
                                        color: 'white',
                                        cursor:
                                            'pointer'
                                    }}
                                >
                                    {isSubmitting
                                        ? 'Enregistrement...'
                                        : editingCategory
                                            ? 'Modifier'
                                            : 'Créer'
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showSkillModal && (
                <div
                    onClick={closeSkillModal}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background:
                            'rgba(15, 23, 42, 0.55)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        zIndex: 1000
                    }}
                >
                    <div
                        onClick={event =>
                            event.stopPropagation()
                        }
                        style={{
                            width: '100%',
                            maxWidth: '480px',
                            background: 'white',
                            borderRadius: '12px',
                            padding: '24px',
                            boxShadow:
                                '0 20px 50px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent:
                                    'space-between',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}
                        >
                            <h2>
                                {editingSkill
                                    ? 'Modifier la compétence'
                                    : 'Nouvelle compétence'
                                }
                            </h2>
                            <button
                                type="button"
                                onClick={closeSkillModal}
                                style={{
                                    border: 'none',
                                    background:
                                        'transparent',
                                    fontSize: '1.3rem',
                                    cursor: 'pointer'
                                }}
                            >
                                ×
                            </button>
                        </div>
                        {error && (
                            <p
                                style={{
                                    color: '#b91c1c',
                                    background:
                                        '#fee2e2',
                                    padding: '10px',
                                    borderRadius: '6px'
                                }}
                            >
                                {error}
                            </p>
                        )}
                        <form
                            onSubmit={
                                handleSkillSubmit
                            }
                        >
                            <div
                                style={{
                                    marginBottom: '16px'
                                }}
                            >
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom:
                                            '7px',
                                        fontWeight:
                                            '500'
                                    }}
                                >
                                    Nom
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        skillForm.name
                                    }
                                    onChange={
                                        handleSkillChange
                                    }
                                    placeholder="Ex : React"
                                    required
                                    autoFocus
                                    style={{
                                        width: '100%',
                                        boxSizing:
                                            'border-box',
                                        padding:
                                            '11px 12px',
                                        border:
                                            '1px solid #cbd5e1',
                                        borderRadius:
                                            '7px'
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    marginBottom: '16px'
                                }}
                            >
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom:
                                            '7px',
                                        fontWeight:
                                            '500'
                                    }}
                                >
                                    Catégorie
                                </label>
                                <select
                                    name="category_id"
                                    value={
                                        skillForm.category_id
                                    }
                                    onChange={
                                        handleSkillChange
                                    }
                                    required
                                    style={{
                                        width: '100%',
                                        boxSizing:
                                            'border-box',
                                        padding:
                                            '11px 12px',
                                        border:
                                            '1px solid #cbd5e1',
                                        borderRadius:
                                            '7px',
                                        background:
                                            'white'
                                    }}
                                >
                                    <option value="">
                                        Sélectionner une
                                        catégorie
                                    </option>

                                    {categories.map(
                                        category => (

                                            <option
                                                key={
                                                    category.id
                                                }
                                                value={
                                                    category.id
                                                }
                                            >
                                                {category.nom}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                            <div
                                style={{
                                    marginBottom: '20px'
                                }}
                            >
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom:
                                            '7px',
                                        fontWeight:
                                            '500'
                                    }}
                                >
                                    Icône
                                </label>
                                <input
                                    type="text"
                                    name="icon_path"
                                    value={
                                        skillForm.icon_path
                                    }
                                    onChange={
                                        handleSkillChange
                                    }
                                    placeholder="Ex : /icons/react.svg"
                                    style={{
                                        width: '100%',
                                        boxSizing:
                                            'border-box',
                                        padding:
                                            '11px 12px',
                                        border:
                                            '1px solid #cbd5e1',
                                        borderRadius:
                                            '7px'
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent:
                                        'flex-end',
                                    gap: '10px'
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={
                                        closeSkillModal
                                    }
                                    style={{
                                        border: 'none',
                                        padding:
                                            '10px 16px',
                                        borderRadius:
                                            '7px',
                                        cursor:
                                            'pointer'
                                    }}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        isSubmitting
                                    }
                                    style={{
                                        border: 'none',
                                        padding:
                                            '10px 16px',
                                        borderRadius:
                                            '7px',
                                        background:
                                            '#263d32',
                                        color: 'white',
                                        cursor:
                                            'pointer'
                                    }}
                                >
                                    {isSubmitting
                                        ? 'Enregistrement...'
                                        : editingSkill
                                            ? 'Modifier'
                                            : 'Ajouter'
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}