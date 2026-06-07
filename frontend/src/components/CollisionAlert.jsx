import { getRiskColor } from '../utils/collision'

export default function CollisionAlert({ threats, onSelectSat, satellites }) {
  if (!threats.length) return null

  const satById = Object.fromEntries(satellites.map(s => [s.id, s]))

  return (
    <div style={{
      position:     'absolute',
      top:          '60px',
      right:        '16px',
      width:        '260px',
      maxHeight:    '320px',
      overflowY:    'auto',
      display:      'flex',
      flexDirection:'column',
      gap:          '6px',
      zIndex:       10,
      fontFamily:   '"JetBrains Mono", monospace',
    }}>
      {threats.slice(0, 10).map((t, i) => {
        const color = getRiskColor(t.risk)
        return (
          <div
            key={i}
            style={{
              background:   '#070f1e',
              border:       `1px solid ${color}44`,
              borderLeft:   `3px solid ${color}`,
              borderRadius: '4px',
              padding:      '8px 10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '9px', color, fontWeight: 700, letterSpacing: '1px' }}>
                {t.risk}
              </span>
              <span style={{ fontSize: '10px', color, fontWeight: 700 }}>
                {t.distance.toLocaleString()} km
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <SatChip id={t.satA} onClick={() => onSelectSat(satById[t.satA])} />
              <span style={{ color: '#475569', fontSize: '10px' }}>↔</span>
              <SatChip id={t.satB} onClick={() => onSelectSat(satById[t.satB])} />
            </div>
          </div>
        )
      })}

      {threats.length > 10 && (
        <div style={{ textAlign: 'center', fontSize: '10px', color: '#475569', padding: '4px' }}>
          +{threats.length - 10} more threats
        </div>
      )}
    </div>
  )
}

function SatChip({ id, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background:   '#0a1628',
        border:       '1px solid #1e3a5f',
        borderRadius: '3px',
        padding:      '2px 6px',
        fontSize:     '10px',
        color:        '#94a3b8',
        cursor:       'pointer',
        fontFamily:   'inherit',
        flex:         1,
        overflow:     'hidden',
        textOverflow: 'ellipsis',
        whiteSpace:   'nowrap',
      }}
    >
      {id}
    </button>
  )
}
