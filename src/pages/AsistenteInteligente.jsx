import { useState, useRef, useEffect, Fragment } from 'react'
import recursosData from '../data/recursosBase.json'
import chatData from '../data/chatRespuestas.json'
import Icon from '../components/ui/Icon'
import { useToast } from '../components/ui/Toast'
import styles from './AsistenteInteligente.module.css'

// Tipo de archivo reconocible de un vistazo
const EXT_COLOR = {
  pdf: { color: 'var(--red-700)', background: 'var(--red-50)' },
  docx: { color: 'var(--g1)', background: 'var(--g1-bg)' },
  pptx: { color: 'var(--amber-700)', background: 'var(--amber-50)' },
  mp4: { color: 'var(--violet-700)', background: 'var(--violet-50)' },
  png: { color: 'var(--g2)', background: 'var(--g2-bg)' },
  default: { color: 'var(--ink-2)', background: 'var(--sunken)' },
}

/* ── Formato liviano para las respuestas (negritas, listas, párrafos) ── */
function inline(text) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (/^\*[^*]+\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>
    return <Fragment key={i}>{part}</Fragment>
  })
}

const BULLET = /^\s*[-•*]\s+/
const NUMBERED = /^\s*\d+[.)]\s+/
const lineKind = (l) => (BULLET.test(l) ? 'ul' : NUMBERED.test(l) ? 'ol' : 'p')

function RichText({ text }) {
  // Agrupa líneas consecutivas del mismo tipo: así "Intro:\n- a\n- b" muestra el texto y luego la lista
  const groups = []
  String(text).trim().split(/\n{2,}/).forEach((block) => {
    block.split('\n').forEach((line, j) => {
      const kind = lineKind(line)
      const last = groups[groups.length - 1]
      if (last && last.kind === kind && j > 0) last.lines.push(line)
      else groups.push({ kind, lines: [line] })
    })
  })

  return groups.map((g, i) => {
    if (g.kind === 'ul') {
      return <ul key={i}>{g.lines.map((l, j) => <li key={j}>{inline(l.replace(BULLET, ''))}</li>)}</ul>
    }
    if (g.kind === 'ol') {
      return <ol key={i}>{g.lines.map((l, j) => <li key={j}>{inline(l.replace(NUMBERED, ''))}</li>)}</ol>
    }
    return (
      <p key={i}>
        {g.lines.map((l, j) => <Fragment key={j}>{j > 0 && <br />}{inline(l)}</Fragment>)}
      </p>
    )
  })
}

// Ícono y tono de cada tarjeta de sugerencia, por posición
const SUGGESTION_STYLE = [
  { icon: 'sparkle', tone: 'violet' },
  { icon: 'book', tone: 'blue' },
  { icon: 'layers', tone: 'teal' },
  { icon: 'file', tone: 'coral' },
  { icon: 'book', tone: 'green' },
  { icon: 'pen', tone: 'amber' },
]

/* ── Marca chica de CoraIA junto a su nombre ── */
function CoraMark() {
  return (
    <span className={styles.mark} aria-hidden="true">
      <Icon name="sparkle" size={13} strokeWidth={2} />
    </span>
  )
}

const DELETE_ANIM_MS = 220

function AsistenteInteligente({
  conversations = [],
  activeConversationId,
  onUpdateConversationMessages,
  onCreateConversation,
  onSelectConversation,
  onDeleteConversation,
}) {
  const notify = useToast()
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const newConvRef = useRef(null)
  const [tempMessages, setTempMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [panel, setPanel] = useState(null) // 'history' en pantallas angostas
  const [historyCollapsed, setHistoryCollapsed] = useState(false)
  const [view, setView] = useState('chat') // menú interno: 'chat' | 'kb'
  const [kbQuery, setKbQuery] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const uploadRef = useRef(null)

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
    // Solo baja al último mensaje si hay conversación (la bienvenida arranca arriba)
    if (messages.length === 0 && !isTyping) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isTyping])

  // Altura automática del campo de texto
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  const sendMessage = async (text) => {
    const query = text || input.trim()
    if (!query || isTyping) return
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
      const errorMsg = { role: 'assistant', text: 'No se pudo conectar con el asistente. Verificá que n8n esté corriendo.', error: true }
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

  const selectConversation = (id) => {
    onSelectConversation?.(id)
    setView('chat')
    setPanel(null)
  }

  const newConversation = () => {
    onCreateConversation()
    setView('chat')
    setPanel(null)
    inputRef.current?.focus()
  }

  // Borrado con confirmación en línea y salida animada
  const deleteConversation = (chat) => {
    setConfirmDeleteId(null)
    setDeletingId(chat.id)
    setTimeout(() => {
      onDeleteConversation?.(chat.id)
      setDeletingId(null)
      notify('Conversación eliminada', { detail: chat.title })
      newConvRef.current?.focus()
    }, DELETE_ANIM_MS)
  }

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (file) notify('Recurso recibido', { detail: `${file.name} se está indexando`, tone: 'info' })
    e.target.value = ''
  }

  // Columna de conversaciones: se colapsa en escritorio y es panel superpuesto en pantallas angostas
  const toggleHistory = () => {
    if (window.matchMedia('(max-width: 860px)').matches) setPanel(panel === 'history' ? null : 'history')
    else setHistoryCollapsed((v) => !v)
  }

  const recursosFiltrados = recursosData.filter((r) =>
    r.nombre.toLowerCase().includes(kbQuery.trim().toLowerCase())
  )

  return (
    <div className={`page page--fill ${styles.page}`}>
      <div className={`panel ${styles.workspace} ${historyCollapsed ? styles.collapsed : ''} ${panel ? styles[`open-${panel}`] : ''}`}>

        {/* ── Conversaciones ── */}
        <aside className={styles.history} aria-label="Conversaciones" aria-hidden={historyCollapsed || undefined}>
          <div className={styles.sideHeader}>
            <h2 className={styles.sideTitle}>Conversaciones</h2>
            <button className={`btn btn-icon ${styles.sideClose}`} onClick={() => setPanel(null)} aria-label="Cerrar">
              <Icon name="close" size={16} />
            </button>
          </div>
          <div className={styles.sideAction}>
            <button ref={newConvRef} className="btn btn-primary" onClick={newConversation} style={{ width: '100%' }}>
              <Icon name="plus" />
              Nueva conversación
            </button>
          </div>
          {conversations.length > 0 ? (
            <ul className={styles.historyList}>
              {conversations.map((chat) => {
                const active = activeConversationId === chat.id
                const confirming = confirmDeleteId === chat.id
                return (
                  <li
                    key={chat.id}
                    className={`${styles.historyRow} ${active ? styles.historyActive : ''} ${deletingId === chat.id ? styles.historyLeaving : ''}`}
                    onMouseLeave={() => confirming && setConfirmDeleteId(null)}
                  >
                    {confirming ? (
                      <div
                        className={styles.confirmRow}
                        role="group"
                        aria-label={`¿Eliminar la conversación «${chat.title}»?`}
                        onKeyDown={(e) => { if (e.key === 'Escape') setConfirmDeleteId(null) }}
                      >
                        <Icon name="trash" size={15} />
                        <span className={styles.confirmText}>¿Borrar?</span>
                        <button
                          className={`${styles.confirmBtn} ${styles.confirmYes}`}
                          onClick={() => deleteConversation(chat)}
                          aria-label="Confirmar eliminación"
                          autoFocus
                        >
                          <Icon name="check" size={14} strokeWidth={2.5} />
                        </button>
                        <button
                          className={styles.confirmBtn}
                          onClick={() => setConfirmDeleteId(null)}
                          aria-label="Cancelar"
                        >
                          <Icon name="x" size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          className={styles.historyItem}
                          onClick={() => selectConversation(chat.id)}
                          title={chat.title}
                          aria-current={active ? 'true' : undefined}
                        >
                          <Icon name="chat" size={15} className={styles.historyIcon} />
                          <span className={styles.historyText}>{chat.title}</span>
                        </button>
                        {onDeleteConversation && (
                          <button
                            className={styles.deleteBtn}
                            onClick={() => setConfirmDeleteId(chat.id)}
                            aria-label={`Eliminar conversación «${chat.title}»`}
                            title="Eliminar conversación"
                          >
                            <Icon name="trash" size={15} />
                          </button>
                        )}
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className={styles.sideEmpty}>
              <span className={styles.sideEmptyIcon}><Icon name="chat" size={18} /></span>
              <p>Tus conversaciones van a aparecer acá.</p>
            </div>
          )}
        </aside>

        {/* ── Área principal ── */}
        <section className={styles.main} aria-label="Asistente Inteligente">
          {/* Barra del módulo: logo (único lugar), título y menú interno */}
          <header className={styles.moduleBar}>
            <button
              className={styles.iconBtn}
              onClick={toggleHistory}
              aria-label={historyCollapsed ? 'Mostrar conversaciones' : 'Ocultar conversaciones'}
              title={historyCollapsed ? 'Mostrar conversaciones' : 'Ocultar conversaciones'}
              aria-expanded={!historyCollapsed}
            >
              <Icon name="sidebar" size={18} />
            </button>

            <div className={styles.brand}>
              <img src="/logo.jpg" alt="" className={styles.brandLogo} />
              <div className={styles.brandText}>
                <h1 className={styles.chatTitle}>
                  {view === 'chat' ? (activeConversation?.title || 'Asistente Inteligente') : 'Base de conocimiento'}
                </h1>
                <p className={styles.chatSub}>
                  <span className={styles.liveDot} />
                  Responde solo con tus {indexados} recursos indexados
                </p>
              </div>
            </div>

            <nav className={styles.tabs} role="tablist" aria-label="Secciones del asistente">
              <span className={styles.tabIndicator} data-view={view} aria-hidden="true" />
              <button
                role="tab"
                aria-selected={view === 'chat'}
                className={styles.tab}
                onClick={() => setView('chat')}
              >
                <Icon name="chat" size={15} />
                Chat
              </button>
              <button
                role="tab"
                aria-selected={view === 'kb'}
                className={styles.tab}
                onClick={() => setView('kb')}
              >
                <Icon name="layers" size={15} />
                <span className={styles.tabLabelLong}>Base de conocimiento</span>
                <span className={styles.tabLabelShort}>Base</span>
                <span className={`${styles.tabCount} num`}>{recursosData.length}</span>
              </button>
            </nav>
          </header>

          {view === 'chat' ? (
            <div key="chat" className={styles.chat}>
              <div className={styles.messages}>
                {messages.length === 0 ? (
                  <div className={styles.welcome}>
                    <span className={styles.welcomeBadge}>
                      <Icon name="sparkle" size={13} strokeWidth={2} />
                      Asistente de cátedra
                    </span>
                    <h2 className={styles.welcomeTitle}>
                      ¿Qué preparamos hoy, <span className={styles.gradText}>Prof. Dorigatti</span>?
                    </h2>
                    <p className={styles.welcomeText}>
                      Planificá clases, generá actividades, casos de estudio o bibliografía para{' '}
                      <strong>Gestión de Procesos de Negocio</strong>. Las respuestas se basan exclusivamente
                      en la documentación de tu base de conocimiento.
                    </p>
                    <ul className={styles.suggestions}>
                      {chatData.sugerencias.map((s, i) => {
                        const look = SUGGESTION_STYLE[i % SUGGESTION_STYLE.length]
                        return (
                          <li key={i}>
                            <button
                              id={`sugerencia-${i}`}
                              className={`${styles.suggestion} ${styles[`tone-${look.tone}`]}`}
                              onClick={() => sendMessage(s)}
                            >
                              <span className={styles.suggestionIcon}><Icon name={look.icon} size={17} /></span>
                              <span className={styles.suggestionText}>{s}</span>
                              <Icon name="arrowRight" size={14} className={styles.suggestionArrow} />
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ) : (
                  <div className={styles.thread}>
                    {messages.map((msg, idx) => (
                      msg.role === 'user' ? (
                        <div key={idx} className={styles.userMsg}>
                          <div className={styles.userBubble}>{msg.text}</div>
                        </div>
                      ) : (
                        <div key={idx} className={`${styles.assistantMsg} ${msg.error ? styles.errorMsg : ''}`}>
                          <div className={styles.assistantHead}><CoraMark /> CoraIA</div>
                          <div className={styles.assistantBody}>
                            {msg.error ? (
                              <div className={styles.errorInner}>
                                <Icon name="alert" size={18} />
                                <div><RichText text={msg.text} /></div>
                              </div>
                            ) : (
                              <RichText text={msg.text} />
                            )}
                          </div>
                        </div>
                      )
                    ))}

                    {isTyping && (
                      <div className={styles.assistantMsg} aria-live="polite">
                        <div className={styles.assistantHead}>
                          <CoraMark /> CoraIA
                          <span className={styles.typing}>
                            <span /><span /><span />
                          </span>
                          <span className="visually-hidden">El asistente está escribiendo</span>
                        </div>
                        <div className={`${styles.assistantBody} ${styles.skeleton}`} aria-hidden="true">
                          <span /><span /><span />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className={styles.composerWrap}>
                <div className={styles.composer}>
                  <label htmlFor="chat-input" className="visually-hidden">Escribí tu consulta</label>
                  <textarea
                    id="chat-input"
                    ref={inputRef}
                    rows={1}
                    className={styles.chatInput}
                    placeholder="Escribí tu consulta sobre Gestión de Procesos de Negocio…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    id="chat-send"
                    className={styles.sendBtn}
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isTyping}
                    aria-label="Enviar"
                  >
                    <Icon name="send" size={16} strokeWidth={2.25} />
                  </button>
                </div>
                <p className={styles.inputNote}>
                  <kbd>Enter</kbd> para enviar · <kbd>Shift</kbd> + <kbd>Enter</kbd> para nueva línea
                </p>
              </div>
            </div>
          ) : (
            /* ── Base de conocimiento (vista interna) ── */
            <div key="kb" className={styles.kbView}>
              <div className={styles.kbToolbar}>
                <div className={styles.kbStatsRow}>
                  <span className={styles.kbStat}><b className="num">{recursosData.length}</b> recursos</span>
                  <span className={`${styles.kbStat} ${styles.kbStatOk}`}><b className="num">{indexados}</b> indexados</span>
                  {procesando > 0 && (
                    <span className={`${styles.kbStat} ${styles.kbStatBusy}`}><b className="num">{procesando}</b> procesando</span>
                  )}
                </div>
                <div className={styles.kbActions}>
                  <div className={`search ${styles.kbSearch}`}>
                    <Icon name="search" />
                    <input
                      type="search"
                      className="field"
                      placeholder="Buscar recurso"
                      aria-label="Buscar recurso"
                      value={kbQuery}
                      onChange={(e) => setKbQuery(e.target.value)}
                    />
                  </div>
                  <input ref={uploadRef} type="file" className="visually-hidden" tabIndex={-1} onChange={handleUpload} />
                  <button id="kb-upload-btn" className="btn btn-primary" onClick={() => uploadRef.current?.click()}>
                    <Icon name="upload" />
                    Subir recurso
                  </button>
                </div>
              </div>

              {recursosFiltrados.length > 0 ? (
                <ul className={styles.kbGrid}>
                  {recursosFiltrados.map((recurso) => {
                    const processing = recurso.estado !== 'Indexado'
                    return (
                      <li key={recurso.id} className={styles.kbCard}>
                        <span className={styles.ext} style={EXT_COLOR[recurso.extension] || EXT_COLOR.default} aria-hidden="true">
                          {recurso.extension.toUpperCase().slice(0, 4)}
                        </span>
                        <div className={styles.kbInfo}>
                          <p className={styles.kbName} title={recurso.nombre}>{recurso.nombre}</p>
                          <p className={styles.kbMeta}>
                            {processing ? (
                              <span className={styles.kbProcessing}><span className={styles.pulse} />Procesando…</span>
                            ) : (
                              <>{recurso.tamano} · {recurso.fecha}</>
                            )}
                          </p>
                          {processing && <span className={styles.kbProgress} aria-hidden="true"><span /></span>}
                        </div>
                        {!processing && (
                          <span className={styles.kbOk} title="Indexado">
                            <Icon name="check" size={13} strokeWidth={2.5} />
                            <span className="visually-hidden">Indexado</span>
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className={styles.kbEmpty}>No hay recursos que coincidan con «{kbQuery}».</p>
              )}
            </div>
          )}
        </section>

        {panel && <div className={styles.scrim} onClick={() => setPanel(null)} />}
      </div>
    </div>
  )
}

export default AsistenteInteligente
