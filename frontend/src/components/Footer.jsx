const GITHUB_URL = 'https://github.com/BambaDiante';
const LINKEDIN_URL = 'https://www.linkedin.com/in/ahmadou-bamba-diant%C3%A9-706938426/';

function GithubIcon(props) {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.02 2.89-.02 3.29 0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12Z" />
        </svg>
    );
}

function LinkedinIcon(props) {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
        </svg>
    );
}

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <p className="footer-copy">
                ©{year}, Ahmadou Bamba Diante.
            </p>

            <div className="footer-socials">
                <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-link"
                    aria-label="Voir mon profil GitHub"
                >
                    <GithubIcon />
                </a>
                <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-link"
                    aria-label="Voir mon profil LinkedIn"
                >
                    <LinkedinIcon />
                </a>
            </div>
        </footer>
    );
}

export default Footer;