import './styles/Style.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Projet from './components/Projet.jsx'
import Competences from './components/Competences.jsx'
import Header from './components/Header.jsx'
import About from './components/About.jsx'
import Parcours from './components/Parcours.jsx'
import Contact from './components/Contact.jsx'
import Login from './components/Admin/Login.jsx'
import AdminDashboard from './components/Admin/Dashboard.jsx'
import api from './services/api.js'

function Portfolio() {
  return (
    <main className="portfolio">
      <Header/>
      <About/>
      <Parcours/>
      <Projet />
      <Competences />
      <Contact/>
    </main>
  )
}

function RequireAdminAuth({ children }) {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    api.get('/user')
      .then(() => setStatus('ready'))
      .catch(() => setStatus('unauthenticated'))
  }, [])

  if (status === 'loading') {
    return (
      <main className="auth-page">
        <p className="feedback">Verification de la session...</p>
      </main>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/Projet" element={<Projet/>}/>
        <Route path="/Contact" element={<Contact/>}/>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/dashboard"
          element={(
            <RequireAdminAuth>
              <AdminDashboard />
            </RequireAdminAuth>
          )}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
