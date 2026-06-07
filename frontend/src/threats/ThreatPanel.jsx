import { getRiskColor } from '../utils/collision'

export default function ThreatPanel({ threats, visible, onClose }) {
  if (!visible) return null

  const critical = threats.filter(t => t.risk === 'CRITICAL')
  const warning  = threats.filter(t => t.risk === 'WARNING')
  const watch    = threats.filter(t => t.risk === 'WATCH')

  return (
    <div style={{
      position:     'absolute',
      top:          '60px',
      left:         '256px',
      width:        '340px',
      maxHeight:    'calc(100vh - 120px)',
      overflowY:    'auto',
      background:   '#070f1e',
      border:       '1px solid #1e3a5f',
      borderRadius: '6px',
      fontFamily:   '"JetBrains Mono", monospace',
      zIndex:       20,
    }}>
      {/* Header */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        padding:        '10px 14px',
        borderBottom:   '1px solid #1e3a5f',
        background:     '#0a1628',
        position:       'sticky',
        top:            0,
      }}>
        <span style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 700, letterSpacing: '2px' }}>
          THREAT ANALYSIS
        </span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '16px' }}>×</button>
      </div>

      {/* Summary row */}
      <div style={{ display: 'flex', padding: '10px 14px', gap: '16px', borderBottom: '1px solid #1e3a5f' }}>
        <SummaryBadge count={critical.length} label="CRITICAL" color="#ef4444" />
        <SummaryBadge count={warning.length}  label="WARNING"  color="#f59e0b" />
        <SummaryBadge count={watch.length}    label="WATCH"    color="#eab308" />
      </div>

      {/* Threat list */}
      {!threats.length && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#475569', fontSize: '11px' }}>
          No active threats detected
        </div>
      )}

      {[...critical, ...warning, ...watch].map((t, i) => (
        <ThreatRow key={i} threat={t} />
      ))}
    </div>
  )
}

function SummaryBadge({ count, label, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontSize: '18px', fontWeight: 700, color }}>{count}</span>
      <span style={{ fontSize: '9px', color: '#475569', letterSpacing: '1px' }}>{label}</span>
    </div>
  )
}

function ThreatRow({ threat }) {
  const color = getRiskColor(threat.risk)
  return (
    <div style={{
      padding:      '8px 14px',
      borderBottom: '1px solid #0d1f38',
      display:      'flex',
      alignItems:   'center',
      gap:          '10px',
    }}>
      <div style={{ width: '3px', height: '32px', background: color, borderRadius: '2px', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '10px', color: '#94a3b8' }}>
          {threat.satA} <span style={{ color: '#475569' }}>↔</span> {threat.satB}
        </div>
        <div style={{ fontSize: '9px', color: '#475569', marginTop: '3px' }}>
          closest approach: <span style={{ color }}>{threat.distance.toLocaleString()} km</span>
        </div>
      </div>
      <span style={{ fontSize: '9px', color, fontWeight: 700, letterSpacing: '1px' }}>
        {threat.risk}
      </span>
    </div>
  )
}
