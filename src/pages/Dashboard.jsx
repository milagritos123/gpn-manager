import DashboardHeader from '../components/dashboard/DashboardHeader'
import KpiStrip from '../components/dashboard/KpiStrip'
import BarChart from '../components/dashboard/BarChart'
import RecentWorks from '../components/dashboard/RecentWorks'
import RecentPlagio from '../components/dashboard/RecentPlagio'
import metricsData from '../data/metrics.json'
import userData from '../data/user.json'
import trabajosData from '../data/trabajosGrupales.json'
import historialData from '../data/historialPlagio.json'
import styles from './Dashboard.module.css'

const metrics = Object.fromEntries(metricsData.map((m) => [m.id, m.value]))

function Dashboard({ onNavigate }) {
  return (
    <div className="page">
      <DashboardHeader user={userData} />

      {/* 1. Métricas del cuatrimestre */}
      <KpiStrip metrics={metrics} onNavigate={onNavigate} />

      {/* 2. Distribución de calificaciones + trabajos recientes */}
      <div className={styles.row}>
        <BarChart onNavigate={onNavigate} />
        <RecentWorks trabajos={trabajosData.slice(0, 5)} onNavigate={onNavigate} />
      </div>

      {/* 3. Últimos análisis de plagio */}
      <RecentPlagio analisis={historialData.slice(0, 4)} onNavigate={onNavigate} />
    </div>
  )
}

export default Dashboard
