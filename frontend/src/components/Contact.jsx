import { useEffect, useState } from 'react';
import api, { getCsrfCookie } from '../services/api';

function Contact(){
    const [contact,setcontact]=useState([]);
    const [isSend, setIsSend] = useState(false);
    const [form, setForm] = useState({ 
        email: '', 
        nom: '', 
        prenom:'',
        sujet: '', 
        description: '' 
    });
    const [error, setError] = useState('');

    function handleChange(event) {
        setForm({
            ...form, 
            [event.target.name]: event.target.value 
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setIsSend(true);

        try {
            await getCsrfCookie();
            await api.post('/contact', form);
        } catch (requestError) {
            setError(requestError.response?.data?.message ?? 'Connexion impossible.');
            //le .? signifie accede a l'element si ce qui se trouve a gauche n'est pas null
            //et existe
        } finally {
            setIsSend(false);
        }
    }
    return (
        <main className="contact-section">
            <h3>Intéressé pour une collaboration?</h3>
            <p>Contactez moi:</p>
            <form className='form' onSubmit={handleSubmit}>
                <div className="contact-fields">
                    <div className="form-field">
                        <label htmlFor="email">Adresse email</label>
                        <input id="email" type="email" name="email" placeholder="Ex: example@gmail.com" onChange={handleChange} required />
                    </div>
                    <div className="form-field">
                        <label htmlFor="nom">Nom</label>
                        <input id="nom" type="text" name="nom" placeholder="Ex: Ndiaye" onChange={handleChange} required />
                    </div>
                    <div className="form-field">
                        <label htmlFor="prenom">Prenom</label>
                        <input id="prenom" type="text" name="prenom" placeholder="Ex: Mouhamed" onChange={handleChange} required />
                    </div>
                    <div className="form-field">
                        <label htmlFor="sujet">Sujet de la collaboration</label>
                        <input id="sujet" type="text" name="sujet" placeholder="Ex: Creation de site e-commerce" onChange={handleChange} required />
                    </div>
                    <div className="form-field form-field-full">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" name="description" placeholder="Décrivez votre projet en détail..." value={form.description} onChange={handleChange} rows="5" required />
                    </div>
                </div>

               
                <button type="submit" disabled={isSend}>
                    {isSend ? 'Envoi en cours...' : 'Envoyer'}
                </button>

            </form>
        </main>
    );
    
}

export default Contact;