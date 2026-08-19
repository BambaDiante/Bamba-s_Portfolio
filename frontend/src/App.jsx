import './styles/App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Projet from './components/Projet.jsx'
import Competences from './components/Competences.jsx'
import Header from './components/Header.jsx'
import About from './components/About.jsx'
import Login from './components/Admin/Login.jsx'
import AdminDashboard from './components/Admin/Dashboard.jsx'

function Portfolio() {
  return (
    <main className="portfolio">
      <Header/>
      <About/>
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
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
