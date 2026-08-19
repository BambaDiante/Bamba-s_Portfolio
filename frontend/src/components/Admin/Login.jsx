import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getCsrfCookie } from '../services/api';

function AdminLogin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: 'admin@example.com', password: 'admin123!' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await getCsrfCookie();
            await api.post('/admin/login', form);
            navigate('/admin');
        } catch (requestError) {
            setError(requestError.response?.data?.message ?? 'Connexion impossible.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-panel" aria-labelledby="login-title">
                <p className="eyebrow">Espace privé</p>
                <h1 id="login-title">Connexion admin</h1>
                <p className="auth-intro">Gère tes projets et tes compétences depuis ton espace personnel.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Adresse email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="password">Mot de passe</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />

                    {error && <p className="auth-error" role="alert">{error}</p>}

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <Link className="back-link" to="/">Retour au portfolio</Link>
            </section>
        </main>
    );
}

export default AdminLogin;
