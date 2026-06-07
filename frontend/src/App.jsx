import { useState, useMemo } from 'react'
import Globe from './components/Globe'
import StatsBar from './components/StatsBar'
import SatellitePanel from './components/SatellitePanel'
import CollisionAlert from './components/CollisionAlert'
import InfoDrawer from './components/InfoDrawer'
import PlaybackControls from './components/PlaybackControls'
import ThreatPanel from './threats/ThreatPanel'
import { useSatelliteData } from './hooks/useSatelliteData'
import { useAnimation } from './hooks/useAnimation'
import { useCollisions } from './hooks/useCollisions'
import { getRiskColor } from './utils/collision'

const MAX_DISPLAY_SATS = 50   // was 200, drop to 50 for now

export default function App() {
  const { satellites, meta, loading, error } = useSatelliteData()
  const [selectedSat,   setSelectedSat]   = useState(null)
  const [showThreats,   setShowThreats]   = useState(false)

  // Limit satellites rendered on globe for performance
  const displaySats = useMemo(() =>
    satellites.slice(0, MAX_DISPLAY_SATS), [satellites])

  const maxSteps = useMemo(() => {
    if (!displaySats.length) return 50
    return Math.min(...displaySats.map(s => s.futureLen || 50))
  }, [displaySats])

  const { currentStep, playing, play, pause, reset, seek } = useAnimation(maxSteps, 8)
  const { threats, counts } = useCollisions(displaySats, currentStep)

  // Build threat map: sat id → worst risk level
  const threatMap = useMemo(() => {
    const m = {}
    threats.forEach(t => {
      const priority = { CRITICAL: 3, WARNING: 2, WATCH: 1 }
      if (!m[t.satA] || priority[t.risk] > priority[m[t.satA]]) m[t.satA] = t.risk
      if (!m[t.satB] || priority[t.risk] > priority[m[t.satB]]) m[t.satB] = t.risk
    })
    return m
  }, [threats])

  if (loading) return <LoadingScreen />
  if (error)   return <ErrorScreen message={error} />

  return (
    <div style={{
      width:      '100vw',
      height:     '100vh',
      display:    'flex',
      flexDirection: 'column',
      background: '#020817',
      overflow:   'hidden',
      fontFamily: '"JetBrains Mono", monospace',
    }}>
      {/* ── Top stats bar ── */}
      <StatsBar
        meta={meta}
        counts={counts}
        satelliteCount={satellites.length}
        currentStep={currentStep}
        maxSteps={maxSteps}
      />

      {/* ── Main content ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* ── Left panel — satellite list ── */}
        <SatellitePanel
          satellites={displaySats}
          selectedSat={selectedSat}
          onSelect={setSelectedSat}
          threatMap={threatMap}
        />

        {/* ── Globe canvas ── */}
        <div style={{ flex: 1, position: 'relative' }}>
          <Globe
            satellites={displaySats}
            currentStep={currentStep}
            onSelectSat={setSelectedSat}
            selectedSat={selectedSat}
            threats={threats}
          />

          {/* ── Collision alerts (top right) ── */}
          <CollisionAlert
            threats={threats}
            satellites={displaySats}
            onSelectSat={setSelectedSat}
          />

          {/* ── Threat panel toggle button ── */}
          {counts.total > 0 && (
            <button
              onClick={() => setShowThreats(v => !v)}
              style={{
                position:     'absolute',
                top:          '12px',
                left:         '12px',
                background:   counts.CRITICAL > 0 ? '#7f1d1d' : '#78350f',
                border:       `1px solid ${counts.CRITICAL > 0 ? '#ef4444' : '#f59e0b'}`,
                borderRadius: '4px',
                color:        counts.CRITICAL > 0 ? '#ef4444' : '#f59e0b',
                padding:      '6px 12px',
                fontSize:     '11px',
                fontFamily:   'inherit',
                cursor:       'pointer',
                letterSpacing:'1px',
                fontWeight:   700,
                animation:    counts.CRITICAL > 0 ? 'blink 1s step-end infinite' : 'none',
              }}
            >
              ⚠ {counts.total} THREAT{counts.total > 1 ? 'S' : ''}
            </button>
          )}

          {/* ── Threat panel ── */}
          <ThreatPanel
            threats={threats}
            visible={showThreats}
            onClose={() => setShowThreats(false)}
          />

          {/* ── Selected satellite info drawer ── */}
          <InfoDrawer
            sat={selectedSat}
            onClose={() => setSelectedSat(null)}
            currentStep={currentStep}
            threatRisk={selectedSat ? threatMap[selectedSat.id] : null}
          />

          {/* ── Legend ── */}
          <Legend />

          {/* ── Playback controls ── */}
          <PlaybackControls
            playing={playing}
            onPlay={play}
            onPause={pause}
            onReset={reset}
            currentStep={currentStep}
            maxSteps={maxSteps}
            onSeek={seek}
          />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar       { width: 4px; }
        ::-webkit-scrollbar-track { background: #070f1e; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 2px; }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        input[type=range] {
          -webkit-appearance: none;
          height: 3px;
          border-radius: 2px;
          background: #1e3a5f;
          outline: none;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #60a5fa;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

// ── Legend ────────────────────────────────────────────────────────────────────
function Legend() {
  const items = [
    { color: '#60a5fa', label: 'Actual track' },
    { color: '#a78bfa', label: 'Predicted (model)' },
    { color: '#34d399', label: 'Future projection' },
    { color: '#ef4444', label: 'Critical threat' },
    { color: '#f59e0b', label: 'Warning' },
  ]
  return (
    <div style={{
      position:   'absolute',
      bottom:     '80px',
      left:       '12px',
      background: '#070f1ecc',
      border:     '1px solid #1e3a5f',
      borderRadius:'4px',
      padding:    '8px 12px',
      display:    'flex',
      flexDirection:'column',
      gap:        '5px',
    }}>
      {items.map(({ color, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '2px', background: color, borderRadius: '1px' }} />
          <span style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.5px' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Loading screen ────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#020817',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: '"JetBrains Mono", monospace',
      gap: '16px',
    }}>
      <div style={{ fontSize: '24px', color: '#60a5fa', fontWeight: 700, letterSpacing: '4px' }}>
        DISHA
      </div>
      <div style={{ fontSize: '11px', color: '#475569', letterSpacing: '2px' }}>
        LOADING SATELLITE DATA...
      </div>
      <div style={{
        width: '120px', height: '2px', background: '#1e3a5f', borderRadius: '1px', overflow: 'hidden'
      }}>
        <div style={{
          height: '100%', width: '40%', background: '#60a5fa', borderRadius: '1px',
          animation: 'slide 1.2s ease-in-out infinite',
        }} />
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
        @keyframes slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  )
}

// ── Error screen ──────────────────────────────────────────────────────────────
function ErrorScreen({ message }) {
  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#020817',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: '"JetBrains Mono", monospace',
      gap: '12px',
    }}>
      <div style={{ fontSize: '14px', color: '#ef4444', fontWeight: 700 }}>
        FAILED TO LOAD DATA
      </div>
      <div style={{ fontSize: '11px', color: '#475569' }}>{message}</div>
      <div style={{ fontSize: '10px', color: '#334155', maxWidth: '320px', textAlign: 'center' }}>
        Make sure predictions.json is in the public/ folder and the dev server is running.
      </div>
    </div>
  )
}
