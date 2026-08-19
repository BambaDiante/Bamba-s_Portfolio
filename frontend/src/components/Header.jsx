import { Link } from 'react-router-dom'
import profilImage from '../assets/profil.png'


function Header(){
    return (
        <div>
            <header className="portfolio-header">
                <div className="portfolio-header-copy">
                    <h1>Développeur FullStack</h1>
                    <br />
                    <h3>Ahmadou Bamba Diante</h3>
                    <p className="intro">Des projets concrets, des interfaces utiles et une stack choisie avec intention.</p>
                </div>
                <div className="portfolio-header-portrait">
                    <img src={profilImage} alt="Photo de profil de Bamba Diante" className="profile-image" />
                </div>
            </header>
        </div>
    )
}

export default Header;