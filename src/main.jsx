import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

// Import components
import Layout from './Layout'
import Discover from './pages/Discover'
import Create from './pages/Create'
import MySongs from './pages/MySongs'
import Quizzes from './pages/Quizzes'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/Discover" element={<Discover />} />
          <Route path="/Create" element={<Create />} />
          <Route path="/MySongs" element={<MySongs />} />
          <Route path="/Quizzes" element={<Quizzes />} />
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)