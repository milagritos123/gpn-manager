import DashboardHeader from '../components/dashboard/DashboardHeader'
import MetricCard from '../components/dashboard/MetricCard'
import BarChart from '../components/dashboard/BarChart'
import ActivityPanel from '../components/dashboard/ActivityPanel'
import metricsData from '../data/metrics.json'
import userData from '../data/user.json'
import styles from './Dashboard.module.css'

function Dashboard({ onNavigate }) {
  return (
    <div className={styles.page}>
      {/* Welcome header */}
      <DashboardHeader user={userData} />

      {/* Metric Cards */}
      <div className={styles.metricsGrid}>
        {metricsData.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            subtitle={metric.subtitle}
            iconBg={metric.iconBg}
            iconColor={metric.iconColor}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Chart + Activity */}
      <div className={styles.bottomGrid}>
        <BarChart />
        <ActivityPanel onNavigate={onNavigate} />
      </div>
    </div>
  )
}

export default Dashboard
