export default function PlaybackControls({ playing, onPlay, onPause, onReset, currentStep, maxSteps, onSeek }) {
  return (
    <div style={{
      position:       'absolute',
      bottom:         '20px',
      left:           '50%',
      transform:      'translateX(-50%)',
      display:        'flex',
      alignItems:     'center',
      gap:            '12px',
      background:     '#070f1ecc',
      backdropFilter: 'blur(8px)',
      border:         '1px solid #1e3a5f',
      borderRadius:   '8px',
      padding:        '8px 16px',
      fontFamily:     '"JetBrains Mono", monospace',
      zIndex:         10,
    }}>
      {/* Reset */}
      <CtrlBtn onClick={onReset} title="Reset">⏮</CtrlBtn>

      {/* Play / Pause */}
      {playing
        ? <CtrlBtn onClick={onPause} title="Pause" highlight>⏸</CtrlBtn>
        : <CtrlBtn onClick={onPlay}  title="Play"  highlight>▶</CtrlBtn>
      }

      {/* Scrubber */}
      <input
        type="range"
        min={0}
        max={maxSteps - 1}
        value={currentStep}
        onChange={e => onSeek(Number(e.target.value))}
        style={{ width: '160px', accentColor: '#60a5fa', cursor: 'pointer' }}
      />

      {/* Step counter */}
      <span style={{ fontSize: '11px', color: '#60a5fa', minWidth: '60px' }}>
        T+{currentStep} / {maxSteps - 1}
      </span>
    </div>
  )
}

function CtrlBtn({ onClick, children, highlight, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background:   highlight ? '#1e3a5f' : 'transparent',
        border:       `1px solid ${highlight ? '#60a5fa' : '#1e3a5f'}`,
        borderRadius: '4px',
        color:        highlight ? '#60a5fa' : '#475569',
        cursor:       'pointer',
        fontSize:     '14px',
        width:        '28px',
        height:       '28px',
        display:      'flex',
        alignItems:   'center',
        justifyContent:'center',
        fontFamily:   'inherit',
      }}
    >
      {children}
    </button>
  )
}
