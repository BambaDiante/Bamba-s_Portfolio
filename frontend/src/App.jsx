import './styles/App.css'
import Projet from './components/Projet.jsx'

function App() {
  return (
    <main className="portfolio">
      <header className="portfolio-header">
        <p className="eyebrow">Portfolio personnel</p>
        <h1>Bamba Diante</h1>
        <p className="intro">Des projets concrets, des interfaces utiles et une stack choisie avec intention.</p>
      </header>
      <Projet />
    </main>
  )
}

export default App
