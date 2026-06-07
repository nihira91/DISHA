import { COLORS } from '../utils/colors'

export default function StatsBar({ meta, counts, satelliteCount, currentStep, maxSteps }) {
  const progress = maxSteps > 0 ? ((currentStep / (maxSteps - 1)) * 100).toFixed(1) : 0

  return (
    <div style={{
      display:         'flex',
      alignItems:      'center',
      gap:             '24px',
      padding:         '10px 20px',
      background:      '#0a1628',
      borderBottom:    '1px solid #1e3a5f',
      fontFamily:      '"JetBrains Mono", monospace',
      fontSize:        '12px',
      color:           '#94a3b8',
      flexWrap:        'wrap',
    }}>
      {/* Logo */}
      <span style={{ color: '#60a5fa', fontWeight: 700, fontSize: '14px', letterSpacing: '3px' }}>
        DISHA
      </span>

      <Stat label="SATELLITES" value={satelliteCount.toLocaleString()} color="#60a5fa" />
      <Stat label="MODEL MAE"  value={`${meta.mae_km} km`}  color="#a78bfa" />
      <Stat label="MODEL RMSE" value={`${meta.rmse_km} km`} color="#a78bfa" />

      <div style={{ width: '1px', height: '20px', background: '#1e3a5f' }} />

      {counts.CRITICAL > 0 && (
        <Stat label="CRITICAL" value={counts.CRITICAL} color="#ef4444" blink />
      )}
      {counts.WARNING > 0 && (
        <Stat label="WARNING"  value={counts.WARNING}  color="#f59e0b" />
      )}
      {counts.WATCH > 0 && (
        <Stat label="WATCH"    value={counts.WATCH}    color="#eab308" />
      )}

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#475569' }}>T+{currentStep}</span>
        <div style={{ width: '80px', height: '3px', background: '#1e3a5f', borderRadius: '2px' }}>
          <div style={{
            width:        `${progress}%`,
            height:       '100%',
            background:   '#60a5fa',
            borderRadius: '2px',
            transition:   'width 0.1s linear',
          }} />
        </div>
        <span style={{ color: '#475569' }}>{progress}%</span>
      </div>
    </div>
  )
}

function Stat({ label, value, color, blink }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontSize: '9px', color: '#475569', letterSpacing: '1px' }}>{label}</span>
      <span style={{
        color,
        fontWeight: 600,
        animation: blink ? 'blink 1s step-end infinite' : 'none',
      }}>
        {value}
      </span>
    </div>
  )
}
