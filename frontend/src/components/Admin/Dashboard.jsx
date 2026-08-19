import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function AdminDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        api.get('/admin/me')
            .then((response) => {
                setUser(response.data);
                setStatus('ready');
            })
            .catch(() => {
                navigate('/admin/login', { replace: true });
            });
    }, [navigate]);

    async function handleLogout() {
        await api.post('/admin/logout');
        navigate('/admin/login', { replace: true });
    }

    if (status === 'loading') {
        return <main className="auth-page"><p className="feedback">Chargement de l'administration...</p></main>;
    }

    return (
        <main className="admin-page">
            <header className="admin-header">
                <div>
                    <p className="eyebrow">Administration</p>
                    <h1>Bonjour, {user.name}</h1>
                </div>
                <button className="logout-button" type="button" onClick={handleLogout}>Se déconnecter</button>
            </header>
            <section className="admin-grid">
                <article className="admin-card">
                    <p className="eyebrow">Contenu</p>
                    <h2>Projets</h2>
                    <p>Ajoute et organise les projets affichés sur ton portfolio.</p>
                    <span className="admin-status">Bientôt disponible</span>
                </article>
                <article className="admin-card">
                    <p className="eyebrow">Profil</p>
                    <h2>Compétences</h2>
                    <p>Gère les technologies et les catégories présentées aux visiteurs.</p>
                    <span className="admin-status">Bientôt disponible</span>
                </article>
            </section>
            <Link className="back-link" to="/">Voir le portfolio</Link>
        </main>
    );
}

export default AdminDashboard;
