import MetricCard from '../components/dashboard/MetricCard'
import BarChart from '../components/dashboard/BarChart'
import ActivityPanel from '../components/dashboard/ActivityPanel'
import metricsData from '../data/metrics.json'
import styles from './Dashboard.module.css'

function Dashboard() {
  return (
    <div className={styles.page}>
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
        <ActivityPanel />
      </div>
    </div>
  )
}

export default Dashboard
