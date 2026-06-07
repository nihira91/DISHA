import { useMemo } from 'react'
import { satColor } from '../utils/colors'
import { orbitType, altitude, orbitalRadius, eciToGeo } from '../utils/coords'
import { getRiskColor } from '../utils/collision'

export default function InfoDrawer({ sat, onClose, currentStep, threatRisk }) {
  if (!sat) return null

  const currentPos = sat.future?.[currentStep] || sat.actual[sat.actual.length - 1]
  const [x, y, z]  = currentPos
  const alt         = Math.round(altitude(x, y, z))
  const radius      = Math.round(orbitalRadius(x, y, z))
  const geo         = eciToGeo(x, y, z)
  const color       = satColor(sat.index)
  const riskColor   = threatRisk ? getRiskColor(threatRisk) : null

  return (
    <div style={{
      position:     'absolute',
      bottom:       '80px',
      right:        '16px',
      width:        '260px',
      background:   '#070f1e',
      border:       `1px solid ${riskColor || '#1e3a5f'}`,
      borderRadius: '6px',
      fontFamily:   '"JetBrains Mono", monospace',
      fontSize:     '11px',
      color:        '#94a3b8',
      zIndex:       10,
      overflow:     'hidden',
    }}>
      {/* Header */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        padding:        '10px 12px',
        borderBottom:   '1px solid #1e3a5f',
        background:     '#0a1628',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: riskColor || color }} />
          <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{sat.id}</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>
          ×
        </button>
      </div>

      {/* Stats */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <Row label="ORBIT TYPE"   value={sat.orbit}              color="#60a5fa" />
        <Row label="ALTITUDE"     value={`${alt.toLocaleString()} km`} />
        <Row label="ORB. RADIUS"  value={`${radius.toLocaleString()} km`} />
        <Row label="LATITUDE"     value={`${geo.lat.toFixed(2)}°`} />
        <Row label="LONGITUDE"    value={`${geo.lng.toFixed(2)}°`} />
        <Row label="STEP"         value={`T+${currentStep}`} />
        {threatRisk && (
          <Row label="RISK" value={threatRisk} color={riskColor} />
        )}
      </div>

      {/* Position */}
      <div style={{ padding: '8px 12px', borderTop: '1px solid #1e3a5f', background: '#0a1628' }}>
        <div style={{ fontSize: '9px', color: '#475569', marginBottom: '4px', letterSpacing: '1px' }}>
          ECI POSITION (km)
        </div>
        <div style={{ color: '#60a5fa', fontSize: '10px' }}>
          [{x.toFixed(1)}, {y.toFixed(1)}, {z.toFixed(1)}]
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '9px', color: '#475569', letterSpacing: '1px' }}>{label}</span>
      <span style={{ color: color || '#e2e8f0', fontWeight: 600 }}>{value}</span>
    </div>
  )
}
