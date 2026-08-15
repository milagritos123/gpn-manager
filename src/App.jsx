import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import CorreccionTP from './pages/CorreccionTP'
import DeteccionPlagio from './pages/DeteccionPlagio'
import GestionAlumnos from './pages/GestionAlumnos'
import AsistenteInteligente from './pages/AsistenteInteligente'
import { useEffect } from 'react'

// Pages that manage their own full height (no inner scroll needed)
const FULL_HEIGHT_PAGES = ['asistente']

function AppShell() {
  const [activePage, setActivePage] = useState('dashboard')
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('gpn_conversations')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('gpn_conversations', JSON.stringify(conversations))
  }, [conversations])

  const [activeConversationId, setActiveConversationId] = useState(null)

  const handleUpdateConversationMessages = (id, messages, title) => {
    setConversations(prev => {
      const exists = prev.some(c => c.id === id)
      if (exists) {
        return prev.map(c => c.id === id ? { ...c, messages, title: title || c.title } : c)
      } else {
        return [{ id, title: title || 'Nueva conversación', messages }, ...prev]
      }
    })
    if (activeConversationId !== id) {
      setActiveConversationId(id)
    }
  }

  const handleCreateConversation = () => {
    setActiveConversationId(null)
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />
      case 'correccion': return <CorreccionTP />
      case 'plagio': return <DeteccionPlagio />
      case 'alumnos': return <GestionAlumnos />
      case 'asistente': return (
        <AsistenteInteligente
          conversations={conversations}
          activeConversationId={activeConversationId}
          onUpdateConversationMessages={handleUpdateConversationMessages}
          onCreateConversation={handleCreateConversation}
        />
      )
      default: return <Dashboard />
    }
  }

  return (
    <Layout
      activePage={activePage}
      onNavigate={setActivePage}
      fullHeight={FULL_HEIGHT_PAGES.includes(activePage)}
      conversations={conversations}
      activeConversationId={activeConversationId}
      onSelectConversation={setActiveConversationId}
      onCreateConversation={handleCreateConversation}
    >
      {renderPage()}
    </Layout>
  )
}

function App() {
  return (
    <Routes>
      {/* Login is the entry point */}
      <Route path="/" element={<Login />} />

      {/* Main app behind login */}
      <Route path="/app/*" element={<AppShell />} />

      {/* Catch-all → login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
