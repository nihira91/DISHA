import { useState } from 'react'
import { satColor } from '../utils/colors'
import { getRiskColor } from '../utils/collision'

export default function SatellitePanel({ satellites, selectedSat, onSelect, threatMap }) {
  const [search,    setSearch]    = useState('')
  const [orbitFilter, setOrbit]   = useState('ALL')
  const [riskFilter,  setRisk]    = useState('ALL')

  const filtered = satellites.filter(sat => {
    if (search && !sat.id.toLowerCase().includes(search.toLowerCase())) return false
    if (orbitFilter !== 'ALL' && sat.orbit !== orbitFilter)              return false
    const risk = threatMap[sat.id]
    if (riskFilter === 'THREAT' && !risk) return false
    return true
  })

  return (
    <div style={{
      width:       '240px',
      minWidth:    '240px',
      background:  '#070f1e',
      borderRight: '1px solid #1e3a5f',
      display:     'flex',
      flexDirection: 'column',
      height:      '100%',
      fontFamily:  '"JetBrains Mono", monospace',
    }}>
      {/* Search */}
      <div style={{ padding: '12px', borderBottom: '1px solid #1e3a5f' }}>
        <input
          placeholder="search satellite id..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width:       '100%',
            background:  '#0a1628',
            border:      '1px solid #1e3a5f',
            borderRadius:'4px',
            padding:     '6px 10px',
            color:       '#94a3b8',
            fontSize:    '11px',
            fontFamily:  'inherit',
            outline:     'none',
            boxSizing:   'border-box',
          }}
        />
      </div>

      {/* Filters */}
      <div style={{ padding: '8px 12px', display: 'flex', gap: '6px', borderBottom: '1px solid #1e3a5f', flexWrap: 'wrap' }}>
        {['ALL','LEO','MEO','GEO'].map(o => (
          <FilterBtn key={o} label={o} active={orbitFilter === o} onClick={() => setOrbit(o)} />
        ))}
        <FilterBtn label="⚠ THREAT" active={riskFilter === 'THREAT'}
          onClick={() => setRisk(r => r === 'THREAT' ? 'ALL' : 'THREAT')}
          color="#f59e0b"
        />
      </div>

      {/* Count */}
      <div style={{ padding: '6px 12px', fontSize: '10px', color: '#475569', borderBottom: '1px solid #1e3a5f' }}>
        {filtered.length} / {satellites.length} satellites
      </div>

      {/* List */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {filtered.map(sat => {
          const risk      = threatMap[sat.id]
          const riskColor = risk ? getRiskColor(risk) : null
          const isSelected = selectedSat?.id === sat.id

          return (
            <div
              key={sat.id}
              onClick={() => onSelect(sat)}
              style={{
                padding:     '8px 12px',
                cursor:      'pointer',
                borderBottom:'1px solid #0d1f38',
                background:  isSelected ? '#0f2044' : 'transparent',
                borderLeft:  isSelected ? '2px solid #60a5fa' : '2px solid transparent',
                display:     'flex',
                alignItems:  'center',
                gap:         '8px',
                transition:  'background 0.15s',
              }}
            >
              {/* Color dot */}
              <div style={{
                width:        '6px',
                height:       '6px',
                borderRadius: '50%',
                background:   riskColor || satColor(sat.index),
                flexShrink:   0,
              }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '11px', color: '#e2e8f0', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {sat.id}
                </div>
                <div style={{ fontSize: '9px', color: '#475569', marginTop: '2px' }}>
                  {sat.orbit} · {sat.altitude.toLocaleString()} km
                </div>
              </div>

              {risk && (
                <span style={{ fontSize: '9px', color: riskColor, fontWeight: 700 }}>
                  {risk}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FilterBtn({ label, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding:      '3px 8px',
        fontSize:     '9px',
        fontFamily:   'inherit',
        background:   active ? '#1e3a5f' : 'transparent',
        border:       `1px solid ${active ? '#60a5fa' : '#1e3a5f'}`,
        borderRadius: '3px',
        color:        color || (active ? '#60a5fa' : '#475569'),
        cursor:       'pointer',
        letterSpacing:'0.5px',
      }}
    >
      {label}
    </button>
  )
}
