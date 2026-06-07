import { useMemo } from 'react'
import { computeCollisions } from '../utils/collision'

export function useCollisions(satellites, currentStep) {
  const threats = useMemo(() => {
    if (!satellites.length) return []
    return computeCollisions(satellites, currentStep, 'future')
  }, [satellites, currentStep])

  const counts = useMemo(() => ({
    CRITICAL: threats.filter(t => t.risk === 'CRITICAL').length,
    WARNING:  threats.filter(t => t.risk === 'WARNING').length,
    WATCH:    threats.filter(t => t.risk === 'WATCH').length,
    total:    threats.length,
  }), [threats])

  return { threats, counts }
}
