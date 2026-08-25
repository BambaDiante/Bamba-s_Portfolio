import { useEffect, useState } from 'react';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import api, { getCsrfCookie } from '../../services/api';

export default function AdminMessage() {
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        loadMessages();
    }, []);

    async function loadMessages() {
        try {
            setStatus('loading');
            setError('');
            const response = await api.get('/admin/messages');
            const data = Array.isArray(response.data) ? response.data : [];
            // Les plus récents en premier
            data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setMessages(data);
            setStatus('ready');
        } catch (err) {
            console.error('Erreur lors du chargement des messages :', err);
            setError('Impossible de charger les messages.');
            setStatus('error');
        }
    }

    async function handleDeleteMessage(messageId) {
        const confirmed = window.confirm('Voulez-vous vraiment supprimer ce message ?');
        if (!confirmed) return;

        try {
            await getCsrfCookie();
            await api.delete(`/admin/messages/${messageId}`);
            setMessages(currentMessages =>
                currentMessages.filter(message => message.id !== messageId)
            );
        } catch (err) {
            console.error('Erreur lors de la suppression :', err);
            alert(err.response?.data?.message || 'Impossible de supprimer le message.');
        }
    }

    function toggleExpand(messageId) {
        setExpandedId(currentId => (currentId === messageId ? null : messageId));
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return (
        <section className="messages-section" aria-labelledby="messages-title">
            <div className="section-heading">
                <div>
                    <h2 id="messages-title" className="projects-title">Messages reçus</h2>
                </div>
                <span className="project-count">
                    {messages.length.toString().padStart(2, '0')} message{messages.length !== 1 ? 's' : ''}
                </span>
            </div>

            {status === 'loading' && <p className="feedback">Chargement des messages...</p>}
            {status === 'error' && <p className="feedback form-error">{error}</p>}
            {status === 'ready' && messages.length === 0 && (
                <p className="feedback">Aucun message reçu pour le moment.</p>
            )}

            {messages.length > 0 && (
                <div className="messages-list">
                    {messages.map(message => {
                        const isExpanded = expandedId === message.id;

                        return (
                            <article
                                className={`message-card ${isExpanded ? 'message-card-expanded' : ''}`}
                                key={message.id}
                            >
                                <div
                                    className="message-summary"
                                    onClick={() => toggleExpand(message.id)}
                                >
                                    <div className="message-summary-icon">
                                        {isExpanded ? <MailOpen size={18} /> : <Mail size={18} />}
                                    </div>

                                    <div className="message-summary-info">
                                        <div className="message-summary-top">
                                            <span className="message-sender">
                                                {message.prenom} {message.nom}
                                            </span>
                                            <span className="message-date">
                                                {formatDate(message.created_at)}
                                            </span>
                                        </div>
                                        <p className="message-subject">{message.subject}</p>
                                    </div>

                                    <button
                                        type="button"
                                        title="Supprimer"
                                        className="icon-button delete-button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleDeleteMessage(message.id);
                                        }}
                                        aria-label={`Supprimer le message de ${message.prenom} ${message.nom}`}
                                    >
                                        <Trash2 size={16} strokeWidth={2} />
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div className="message-details">
                                        <p className="message-field">
                                            <strong>Email :</strong>{' '}
                                            <a href={`mailto:${message.email}`}>{message.email}</a>
                                        </p>
                                        <p className="message-content">{message.content}</p>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
