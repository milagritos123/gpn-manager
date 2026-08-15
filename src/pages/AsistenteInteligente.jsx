import { useState, useRef, useEffect } from 'react'
import recursosData from '../data/recursosBase.json'
import chatData from '../data/chatRespuestas.json'
import styles from './AsistenteInteligente.module.css'

// File type → color map
const FILE_COLORS = {
  pdf: '#EF4444', pptx: '#F59E0B', docx: '#3B82F6',
  mp4: '#8B5CF6', png: '#10B981', default: '#6B7280',
}

function AsistenteInteligente({
  conversations = [],
  activeConversationId,
  onUpdateConversationMessages,
  onCreateConversation
}) {
  const [tempMessages, setTempMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const activeConversation = conversations.find(c => c.id === activeConversationId)
  const messages = activeConversationId ? (activeConversation?.messages || []) : tempMessages

  const indexados = recursosData.filter(r => r.estado === 'Indexado').length
  const procesando = recursosData.filter(r => r.estado === 'Procesando').length

  useEffect(() => {
    if (activeConversationId === null) {
      setTempMessages([])
    }
  }, [activeConversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (text) => {
    const query = text || input.trim()
    if (!query) return
    setInput('')

    const userMsg = { role: 'user', text: query }
    const newMessages = [...messages, userMsg]

    let currentId = activeConversationId
    let isNew = false
    if (!currentId) {
      currentId = Date.now().toString()
      isNew = true
    }

    if (isNew) {
      setTempMessages(newMessages)
    } else {
      onUpdateConversationMessages(currentId, newMessages)
    }

    setIsTyping(true)

    try {
      const response = await fetch('http://localhost:5678/webhook/2e1cccf4-e4ee-4b61-8523-e897ac62d608', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          sessionId: currentId
        })
      })

      const data = await response.json()
      const responseText = data.output || data.text || data.message || 'Sin respuesta del asistente.'

      setIsTyping(false)
      const assistantMsg = { role: 'assistant', text: responseText }
      const finalMessages = [...newMessages, assistantMsg]
      const title = isNew ? (query.length > 25 ? query.substring(0, 25) + '...' : query) : undefined

      if (isNew) {
        setTempMessages([])
        onUpdateConversationMessages(currentId, finalMessages, title)
      } else {
        onUpdateConversationMessages(currentId, finalMessages)
      }
    } catch (error) {
      setIsTyping(false)
      const errorMsg = { role: 'assistant', text: 'No se pudo conectar con el asistente. Verificá que n8n esté corriendo.' }
      const finalMessages = [...newMessages, errorMsg]
      if (isNew) {
        setTempMessages([])
        onUpdateConversationMessages(currentId, finalMessages, query.substring(0, 25))
      } else {
        onUpdateConversationMessages(currentId, finalMessages)
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div className={styles.page}>
      {/* ── Chat panel ── */}
      <div className={styles.chatPanel}>
        {/* Header */}
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <p className={styles.chatHeaderTitle}>Asistente Inteligente (RAG)</p>
            <p className={styles.chatHeaderSub}>Preparación de clases basada en tu documentación</p>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messages}>
          {/* Welcome message */}
          <div className={styles.welcomeMsg}>
            <div className={styles.assistantAvatar}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className={styles.welcomeBubble}>
              ¡Hola, Prof. Fernández! 👋 Soy tu asistente inteligente para la preparación de clases de{' '}
              <strong>Gestión de Procesos de Negocio</strong>. Puedo ayudarte a planificar clases, generar
              actividades, crear casos de estudio, recomendar bibliografía y más, utilizando exclusivamente
              la documentación que has cargado en la base de conocimiento.
              <br /><br />
              ¿En qué puedo ayudarte hoy?
            </div>
          </div>

          {/* Suggestions (shown only when no messages yet) */}
          {messages.length === 0 && (
            <div className={styles.suggestionsSection}>
              <span className={styles.suggestionsLabel}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Sugerencias para empezar
              </span>
              <div className={styles.suggestionsGrid}>
                {chatData.sugerencias.map((s, i) => (
                  <button
                    key={i}
                    id={`sugerencia-${i}`}
                    className={styles.suggestionCard}
                    onClick={() => sendMessage(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation */}
          {messages.map((msg, idx) => (
            msg.role === 'user' ? (
              <div key={idx} className={styles.userMsg}>
                <div className={styles.userBubble}>{msg.text}</div>
              </div>
            ) : (
              <div key={idx} className={styles.assistantMsg}>
                <div className={styles.assistantAvatar}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className={styles.assistantBubble}>{msg.text}</div>
              </div>
            )
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className={styles.assistantMsg}>
              <div className={styles.assistantAvatar}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className={`${styles.assistantBubble} ${styles.typing}`}>
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={styles.inputArea}>
          <div className={styles.inputRow}>
            <input
              id="chat-input"
              className={styles.chatInput}
              placeholder="Escribe tu consulta sobre Gestión de Procesos de Negocio..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              id="chat-send"
              className={styles.sendBtn}
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              title="Enviar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className={styles.inputNote}>
            El asistente responde exclusivamente con la documentación cargada en la base de conocimiento
          </p>
        </div>
      </div>

      {/* ── Knowledge Base panel ── */}
      <div className={styles.kbPanel}>
        <div className={styles.kbHeader}>
          <h2 className={styles.kbTitle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Base de conocimiento
          </h2>
          <button id="kb-upload-btn" className={styles.uploadBtn}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 16 12 12 8 16" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
            </svg>
            Subir recurso
          </button>
        </div>

        {/* Stats */}
        <div className={styles.kbStats}>
          <span className={styles.kbStat}>
            <span className={styles.statDotGreen} /> {indexados} indexados
          </span>
          <span className={styles.kbStat}>
            <span className={styles.statDotOrange} /> {procesando} procesando
          </span>
          <span className={styles.statTotal}>{recursosData.length} total</span>
        </div>

        {/* Resource list */}
        <div className={styles.kbList}>
          {recursosData.map((recurso) => {
            const color = FILE_COLORS[recurso.extension] || FILE_COLORS.default
            return (
              <div key={recurso.id} className={styles.kbItem}>
                <div className={styles.kbFileIcon} style={{ backgroundColor: color }}>
                  {recurso.extension.toUpperCase().slice(0, 3)}
                </div>
                <div className={styles.kbFileInfo}>
                  <p className={styles.kbFileName} title={recurso.nombre}>{recurso.nombre}</p>
                  <p className={styles.kbFileMeta}>{recurso.tipo} · {recurso.tamano} · {recurso.fecha}</p>
                </div>
                <span className={`${styles.kbStatus} ${recurso.estado === 'Indexado' ? styles.statusIndexado : styles.statusProcesando}`}>
                  {recurso.estado === 'Indexado' ? '✓ Indexado' : '⏳ Procesando...'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AsistenteInteligente
