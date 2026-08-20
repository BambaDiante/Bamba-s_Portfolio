import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Projet from '../Projet';
import Competences from '../Competences';
import Parcours from '../Parcours';
import About from '../About';
import CreateProjet from './AdminProjet';

function AdminDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        api.get('/user')
            .then((response) => {
                setUser(response.data);
                setStatus('ready');
            })
            .catch(() => {
                navigate('/admin/login', { replace: true });
            });
    }, [navigate]);

    async function handleLogout() {
        await api.post('/logout');
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
            <About/>
            <CreateProjet/>
            <Competences/>
            <Link className="back-link" to="/">Voir le portfolio</Link>
        </main>
    );
}

export default AdminDashboard;
