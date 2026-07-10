import { useState } from 'react'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import CorreccionTP from './pages/CorreccionTP'
import DeteccionPlagio from './pages/DeteccionPlagio'
import AsistenteInteligente from './pages/AsistenteInteligente'

// Pages that manage their own full height (no inner scroll needed)
const FULL_HEIGHT_PAGES = ['asistente']

function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':    return <Dashboard />
      case 'correccion':   return <CorreccionTP />
      case 'plagio':       return <DeteccionPlagio />
      case 'asistente':    return <AsistenteInteligente />
      default:             return <Dashboard />
    }
  }

  return (
    <Layout
      activePage={activePage}
      onNavigate={setActivePage}
      fullHeight={FULL_HEIGHT_PAGES.includes(activePage)}
    >
      {renderPage()}
    </Layout>
  )
}

export default App
