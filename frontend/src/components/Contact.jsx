import { useState } from 'react';
import { Send } from 'lucide-react';
import Reveal from './Reveal';
import api,{getCsrfCookie} from '../services/api.js';


function Contact() {
    const [isSend, setIsSend] = useState(false);
    const [form, setForm] = useState({
        email: '',
        nom: '',
        prenom: '',
        sujet: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }
    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSuccess('');
        setIsSend(true);
        try {
            await getCsrfCookie();
            await api.post('/contact', form);
            setSuccess(
                'Votre message a bien été envoyé. Je vous répondrai dans les meilleurs délais.'
            );
            setForm({
                email: '',
                nom: '',
                prenom: '',
                sujet: '',
                description: ''
            });

        } catch (requestError) {
            setError(
                requestError.response?.data?.message ??
                'Une erreur est survenue lors de l’envoi du message.'
            );
        } finally {
            setIsSend(false);
        }
    }
    return (
        <main className="contact-section">
            <Reveal as="div" className="contact-heading">
                <h2>Contact</h2>
                <h3>
                    Un projet en tête ?
                    <span> Parlons-en.</span>
                </h3>
                <p>
                    Vous avez une idée, un projet ou un besoin spécifique ?
                    Décrivez-moi votre projet et je vous répondrai rapidement.
                </p>
            </Reveal>
            <Reveal as="div" className="contact-card" delay={150}>
                <form
                    className="contact-form"
                    onSubmit={handleSubmit}
                >
                    <div className="contact-fields">
                        <div className="form-field">
                            <label htmlFor="nom">
                                Nom
                            </label>
                            <input
                                id="nom"
                                type="text"
                                name="nom"
                                placeholder="Votre nom"
                                value={form.nom}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="prenom">
                                Prénom
                            </label>
                            <input
                                id="prenom"
                                type="text"
                                name="prenom"
                                placeholder="Votre prénom"
                                value={form.prenom}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="email">
                                Adresse email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="vous@exemple.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="sujet">
                                Sujet
                            </label>
                            <input
                                id="sujet"
                                type="text"
                                name="sujet"
                                placeholder="Ex : Création d'une application web"
                                value={form.sujet}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-field form-field-full">
                            <label htmlFor="description">
                                Présentez votre projet
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Décrivez votre projet, vos besoins, vos objectifs..."
                                value={form.description}
                                onChange={handleChange}
                                rows="6"
                                required
                            />
                        </div>
                    </div>
                    {error && (
                        <div className="contact-message contact-error">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="contact-message contact-success">
                            {success}
                        </div>
                    )}
                    <div className="contact-submit">
                        <button
                            type="submit"
                            disabled={isSend}
                            className="contact-button"
                        >
                            <span>
                                {isSend
                                    ? 'Envoi en cours...'
                                    : 'Envoyer ma demande'}
                            </span>
                            {!isSend && (
                                <Send size={18} />
                            )}
                        </button>
                    </div>
                </form>
            </Reveal>
        </main>
    );
}
export default Contact;