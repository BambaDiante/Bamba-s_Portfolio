import { useEffect, useState } from 'react';
import api, { getCsrfCookie }  from '../../services/api';
import Projet from '../Projet';

export default function CreateProjet() {
    const [skills, setSkills] = useState([]);
    const [showForm, setshowForm] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');

  
    const [form, setForm] = useState({ 
        nom: '', 
        description: '',
        project_image: null, 
        skills: []          
    });

    // Charger les compétences au montage du composant
    useEffect(() => {
        api.get('/competences')
            .then(response => {
                const data = response.data;
                // Gère le cas où l'API renvoie des catégories contenant des skills, ou directement une liste plate
                if (Array.isArray(data)) {
                    setSkills(data);
                } else {
                    setSkills([]);
                }
            })
            .catch(err => {
                console.error("Erreur lors de la récupération des compétences :", err);
            });
    }, []);

    // Gérer les champs texte
    function handleChange(event) {
        setForm({
            ...form, 
            [event.target.name]: event.target.value 
        });
    }

    // Gérer l'upload du fichier image
    function handleFileChange(event) {
        setForm({
            ...form,
            project_image: event.target.files[0]
        });
    }

    // Gérer la sélection des compétences (cases à cocher)
    function handleSkillChange(skillId) {
        const currentSkills = [...form.skills];
        if (currentSkills.includes(skillId)) {
            setForm({ ...form, skills: currentSkills.filter(id => id !== skillId) });
        } else {
            setForm({ ...form, skills: [...currentSkills, skillId] });
        }
    }

    // Soumission du formulaire vers Laravel
    async function handleSubmit(event) {
        event.preventDefault();
        setIsSending(true);
        setError('');

        const formData = new FormData();
        formData.append('nom', form.nom);
        formData.append('description', form.description);
        if (form.project_image) {
            formData.append('project_image', form.project_image);
        }
        form.skills.forEach(skillId => {
            formData.append('skills[]', skillId);
        });

        try {
            await getCsrfCookie();
            await api.post('/admin/create/project', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            alert('Projet créé avec succès !');
            setForm({ nom: '', description: '', project_image: null, skills: [] });
            setshowForm(false);
        } catch (err) {
            console.error("Erreur lors de la création :", err);
            setError(err.response?.data?.message || "Une erreur est survenue.");
        } finally {
            setIsSending(false);
        }
    }

    return (
        <main className="admin-container" style={{ padding: '24px' }}>
            <Projet />

            {/* Bouton d'action principal harmonisé */}
            {!showForm ? (
                <div style={{ marginTop: '24px', textAlign: 'right' }}>
                    <button 
                        onClick={() => setshowForm(true)} 
                        className="btn-primary"
                        style={{ padding: '12px 24px', cursor: 'pointer' }}
                    >
                        + Ajouter un projet
                    </button>
                </div>
            ) : (
                <section className="form-card" style={{ marginTop: '24px', padding: '32px', borderRadius: '12px', background: 'var(--card-bg, #ffffff)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid var(--border-color, #e2e8f0)' }}>
                    <div className="section-heading" style={{ marginBottom: '24px' }}>
                        <p className="eyebrow" style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', color: '#263d32' }}>Administration</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Ajouter un nouveau projet</h3>
                    </div>
                    
                    {error && <p className="feedback-error" style={{ color: '#ef4444', marginBottom: '16px', padding: '10px', background: '#fee2e2', borderRadius: '6px' }}>{error}</p>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Nom du projet :</label>
                            <input 
                                type="text" 
                                name="nom" 
                                value={form.nom} 
                                onChange={handleChange} 
                                required 
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description :</label>
                            <textarea 
                                name="description" 
                                value={form.description} 
                                onChange={handleChange} 
                                required 
                                rows="4"
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Image du projet :</label>
                            <input 
                                type="file" 
                                name="project_image" 
                                accept="image/*"
                                onChange={handleFileChange} 
                                style={{ width: '100%', padding: '8px', background: '#f8fafc', borderRadius: '6px', border: '1px dashed #cbd5e1' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Stack Technique (Compétences) :</label>
                            <div className="skills-selection-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px', maxHeight: '250px', overflowY: 'auto', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                {skills.map(category => (
                                    <div key={category.id || category.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {category.name && (
                                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b' }}>
                                                {category.name}
                                            </span>
                                        )}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', paddingLeft: '8px' }}>
                                            {(category.skills || [category]).map(skill => (
                                                <label key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={form.skills.includes(skill.id)}
                                                        onChange={() => handleSkillChange(skill.id)}
                                                    />
                                                    <span style={{ fontSize: '0.9rem' }}>{skill.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                            <button 
                                type="submit" 
                                disabled={isSending} 
                                style={{ padding: '10px 20px', backgroundColor: '#263d32', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
                            >
                                {isSending ? 'Envoi en cours...' : 'Enregistrer le projet'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setshowForm(false)} 
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