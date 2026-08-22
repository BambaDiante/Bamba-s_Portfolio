import { BrowserRouter, Navigate, Route, Routes,Link } from 'react-router-dom'
import profilImage from '../assets/profil.png'


function Header(){
    return (
        <div>
            <header className="portfolio-header">
                <div className="portfolio-header-copy">
                    <h1 className='role'>Développeur FullStack</h1>
                    <h3>Ahmadou Bamba Diante</h3>
                    <p className="intro">
                        Je transforme des idées en applications web performantes, sécurisées et évolutives.
                        J'allie développement frontend, backend et bonnes
                        pratiques d'ingénierie pour concevoir des 
                        solutions digitales fiables, modernes et 
                        pensées pour accompagner la croissance de vos projets. 
                    </p>
                    <div className="header-actions">
                        <Link to="/Projet" className="btn btn-projects">
                            Voir mes projets
                        </Link>

                        <Link to="/Contact" className="btn btn-contact">
                            Me contacter
                        </Link>
                    </div>
                </div>
                <div className="portfolio-header-portrait">
                    <img src={profilImage} alt="Photo de profil de Bamba Diante" className="profile-image" />
                </div>
            </header>
        </div>
    )
}

export default Header;