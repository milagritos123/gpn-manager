import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import CorreccionTP from './pages/CorreccionTP'
import DeteccionPlagio from './pages/DeteccionPlagio'
import GestionAlumnos from './pages/GestionAlumnos'
import AsistenteInteligente from './pages/AsistenteInteligente'
import { ToastProvider } from './components/ui/Toast'

// Pages that manage their own full height (no inner scroll needed)
const FULL_HEIGHT_PAGES = ['correccion', 'alumnos', 'asistente']

function AppShell() {
  const [activePage, setActivePage] = useState('dashboard')
  // Filtros iniciales que una sección puede recibir al navegar (ej. desde el dashboard)
  const [navParams, setNavParams] = useState(null)
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem('gpn_conversations')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('gpn_conversations', JSON.stringify(conversations))
    } catch { /* almacenamiento no disponible */ }
  }, [conversations])

  const [activeConversationId, setActiveConversationId] = useState(null)

  const handleNavigate = (page, params = null) => {
    setActivePage(page)
    setNavParams(params)
  }

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

  // Borra una conversación; si era la abierta, vuelve a la bienvenida
  const handleDeleteConversation = (id) => {
    setConversations(prev => prev.filter(c => c.id !== id))
    if (activeConversationId === id) setActiveConversationId(null)
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard onNavigate={handleNavigate} />
      case 'correccion': return <CorreccionTP key={JSON.stringify(navParams)} initialFilters={navParams} />
      case 'plagio': return <DeteccionPlagio />
      case 'alumnos': return <GestionAlumnos key={JSON.stringify(navParams)} initialFilters={navParams} />
      case 'asistente': return (
        <AsistenteInteligente
          conversations={conversations}
          activeConversationId={activeConversationId}
          onUpdateConversationMessages={handleUpdateConversationMessages}
          onCreateConversation={handleCreateConversation}
          onSelectConversation={setActiveConversationId}
          onDeleteConversation={handleDeleteConversation}
        />
      )
      default: return <Dashboard onNavigate={handleNavigate} />
    }
  }

  return (
    <Layout
      activePage={activePage}
      onNavigate={handleNavigate}
      fullHeight={FULL_HEIGHT_PAGES.includes(activePage)}
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
      <Route path="/app/*" element={<ToastProvider><AppShell /></ToastProvider>} />

      {/* Catch-all → login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
