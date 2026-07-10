# BPM Manager — Frontend

Frontend de **BPM Manager**, sistema de corrección inteligente de trabajos prácticos con agente de IA.

## Stack tecnológico

- **React 18** + JavaScript (Vite)
- **CSS Modules** — sin librerías de UI externas
- **Datos simulados** en archivos JSON

## Módulos implementados

| Módulo | Descripción |
|---|---|
| **Dashboard** | Métricas, gráfico de barras CSS puro, actividad reciente |
| **Corrección de TP** | Tabla filtrable, badges de categoría/estado, Drawer lateral |
| **Detección de Plagio** | Drag & Drop PDF, análisis simulado, historial con Drawer |
| **Asistente Inteligente** | Chat tipo ChatGPT con RAG simulado, base de conocimiento |

## Instalación

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

## Estructura del proyecto

```
src/
├── components/
│   ├── layout/       # Sidebar, Layout
│   ├── dashboard/    # MetricCard, BarChart, ActivityPanel
│   ├── correccion/   # FilterBar, TPTable, TPDrawer, Badges
│   └── plagio/       # DropZone, ResultCard, Fragmentos, Historial, PlagioDrawer
├── pages/
│   ├── Dashboard.jsx
│   ├── CorreccionTP.jsx
│   ├── DeteccionPlagio.jsx
│   └── AsistenteInteligente.jsx
├── data/             # JSON simulados (métricas, TPs, plagio, chat, recursos)
└── styles/           # global.css con design tokens
```

## Conexión futura con API

Todos los componentes reciben datos por props. Para conectar con un backend real, reemplazar los imports de JSON por llamadas `fetch()` en cada página, sin modificar los componentes.
