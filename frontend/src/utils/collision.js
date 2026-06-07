import { distanceKm } from './coords'

// Thresholds in km
export const COLLISION_THRESHOLDS = {
  CRITICAL: 100,   // red  — immediate danger
  WARNING:  300,   // amber — close approach
  WATCH:    600,   // yellow — monitor
}

export function getRiskLevel(distKm) {
  if (distKm <= COLLISION_THRESHOLDS.CRITICAL) return 'CRITICAL'
  if (distKm <= COLLISION_THRESHOLDS.WARNING)  return 'WARNING'
  if (distKm <= COLLISION_THRESHOLDS.WATCH)    return 'WATCH'
  return 'SAFE'
}

export function getRiskColor(level) {
  switch (level) {
    case 'CRITICAL': return '#ef4444'
    case 'WARNING':  return '#f59e0b'
    case 'WATCH':    return '#eab308'
    default:         return '#22c55e'
  }
}

// Compute all pairs within WATCH threshold at a given step index
// Returns array of { satA, satB, distance, risk }
export function computeCollisions(satellites, stepIndex, dataKey = 'future') {
  const threats = []

  for (let i = 0; i < satellites.length; i++) {
    const satA   = satellites[i]
    const posA   = satA[dataKey]?.[stepIndex]
    if (!posA) continue

    for (let j = i + 1; j < satellites.length; j++) {
      const satB = satellites[j]
      const posB = satB[dataKey]?.[stepIndex]
      if (!posB) continue

      const dist = distanceKm(posA, posB)
      if (dist <= COLLISION_THRESHOLDS.WATCH) {
        threats.push({
          satA:     satA.id,
          satB:     satB.id,
          distance: Math.round(dist),
          risk:     getRiskLevel(dist),
        })
      }
    }
  }

  // Sort by distance ascending (closest first)
  return threats.sort((a, b) => a.distance - b.distance)
}
