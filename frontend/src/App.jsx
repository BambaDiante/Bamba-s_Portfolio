import './styles/App.css'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Projet from './components/Projet.jsx'
import Competences from './components/Competences.jsx'
import AdminLogin from './components/AdminLogin.jsx'
import AdminDashboard from './components/Admin/AdminDashboard.jsx'

function Portfolio() {
  return (
    <main className="portfolio">
      <header className="portfolio-header">
        <p className="eyebrow">Portfolio personnel</p>
        <h1>Bamba Diante</h1>
        <p className="intro">Des projets concrets, des interfaces utiles et une stack choisie avec intention.</p>
        <Link className="admin-link" to="/admin/login">Accéder à l'administration</Link>
      </header>
      <Projet />
      <Competences />
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
