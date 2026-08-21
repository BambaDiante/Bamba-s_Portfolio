import { useEffect, useState } from 'react';
import api, { getCsrfCookie } from '../../services/api';
import Competences from '../Competences';

export default function AdminCompetences() {
    // Liste des catégories (utilisée pour remplir le <select> du formulaire skill)
    const [categories, setCategories] = useState([]);

    const [showskillForm, setshowskillForm] = useState(false);
    const [showcatForm, setshowcatForm] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');

    const [catform, setcatForm] = useState({
        category: '',
    });

    const [skillform, setskillForm] = useState({
        category_id: '',
        skill: '',
    });

    // Charger les catégories au montage du composant
    useEffect(() => {
        api.get('/competences')
            .then(response => {
                const data = response.data;
                // Gère le cas où l'API renvoie directement une liste plate de catégories
                setCategories(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.error("Erreur lors de la récupération des compétences :", err);
            });
    }, []);

    function handleskillChange(event) {
        setskillForm({
            ...skillform,
            [event.target.name]: event.target.value
        });
    }

    function handlecatChange(event) {
        setcatForm({
            ...catform,
            [event.target.name]: event.target.value
        });
    }

    async function handleskillSubmit(event) {
        event.preventDefault();
        setIsSending(true);
        setError('');

        const formData = new FormData();
        formData.append('category_id', skillform.category_id);
        formData.append('name', skillform.name);

        try {
            await getCsrfCookie();
            await api.post('/admin/create/skill', formData);

            alert('Compétence ajoutée avec succès !');
            setskillForm({ category_id: '', skill: '' });
            setshowskillForm(false);
        } catch (err) {
            console.error("Erreur lors de la création :", err);
            setError(err.response?.data?.message || "Une erreur est survenue.");
        } finally {
            setIsSending(false);
        }
    }

    async function handleCompSubmit(event) {
        event.preventDefault();
        setIsSending(true);
        setError('');

        const formData = new FormData();
        formData.append('category', catform.category);

        try {
            await getCsrfCookie();
            await api.post('/admin/create/category', formData);

            alert('Catégorie ajoutée avec succès !');
            setcatForm({ category: '' });
            setshowcatForm(false);
        } catch (err) {
            console.error("Erreur lors de la création :", err);
            setError(err.response?.data?.message || "Une erreur est survenue.");
        } finally {
            setIsSending(false);
        }
    }

    return (
        <main>
            {!showcatForm ? (
                <div style={{ marginTop: '24px', textAlign: 'right' }}>
                    <button
                        onClick={() => setshowcatForm(true)}
                        className="btn-primary"
                        style={{ padding: '12px 24px', cursor: 'pointer' }}
                    >
                        + Ajouter une catégorie
                    </button>
                </div>
            ) : (
                <section
                    className="form-card"
                    style={{
                        marginTop: '24px',
                        padding: '32px',
                        borderRadius: '12px',
                        background: 'var(--card-bg, #ffffff)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: '1px solid var(--border-color, #e2e8f0)'
                    }}
                >
                    <div className="section-heading" style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Ajouter une nouvelle catégorie</h3>
                    </div>

                    {error && (
                        <p
                            className="feedback-error"
                            style={{ color: '#ef4444', marginBottom: '16px', padding: '10px', background: '#fee2e2', borderRadius: '6px' }}
                        >
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleCompSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Catégorie :</label>
                            <input
                                type="text"
                                name="category"
                                value={catform.category}
                                placeholder="Ex: DevOps"
                                onChange={handlecatChange}
                                required
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                <button
                                    type="submit"
                                    disabled={isSending}
                                    style={{ padding: '10px 20px', backgroundColor: '#263d32', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
                                >
                                    {isSending ? 'Envoi en cours...' : 'Ajouter'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setshowcatForm(false)}
                                    style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </form>
                </section>
            )}

            <Competences />

            {!showskillForm ? (
                <div style={{ marginTop: '24px', textAlign: 'right' }}>
                    <button
                        onClick={() => setshowskillForm(true)}
                        className="btn-primary"
                        style={{ padding: '12px 24px', cursor: 'pointer' }}
                    >
                        + Ajouter un skill
                    </button>
                </div>
            ) : (
                <section
                    className="form-card"
                    style={{
                        marginTop: '24px',
                        padding: '32px',
                        borderRadius: '12px',
                        background: 'var(--card-bg, #ffffff)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: '1px solid var(--border-color, #e2e8f0)'
                    }}
                >
                    <div className="section-heading" style={{ marginBottom: '24px' }}>
                        <p
                            className="eyebrow"
                            style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', color: '#263d32' }}
                        >
                            Administration
                        </p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Ajouter un nouveau skill</h3>
                    </div>

                    {error && (
                        <p
                            className="feedback-error"
                            style={{ color: '#ef4444', marginBottom: '16px', padding: '10px', background: '#fee2e2', borderRadius: '6px' }}
                        >
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleskillSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Choisir la catégorie :</label>
                            <select
                                name="category_id"
                                value={skillform.category_id}
                                onChange={handleskillChange}
                                required
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="" disabled>Sélectionner une catégorie</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.nom}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Ajouter le skill :</label>
                            <input
                                type="text"
                                name="name"
                                value={skillform.name}
                                placeholder="Ex: React"
                                onChange={handleskillChange}
                                required
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                            <button
                                type="submit"
                                disabled={isSending}
                                style={{ padding: '10px 20px', backgroundColor: '#263d32', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
                            >
                                {isSending ? 'Envoi en cours...' : 'Ajouter'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setshowskillForm(false)}
                                style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
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