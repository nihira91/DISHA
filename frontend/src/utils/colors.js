import { altitude, orbitalRadius } from './coords'

// Palette — space-themed
export const COLORS = {
  actual:    '#60a5fa',   // blue   — historical track
  predicted: '#a78bfa',  // purple — model prediction
  future:    '#34d399',  // green  — future projection
  earth:     '#1e3a5f',
  atmosphere:'#1d4ed8',
  grid:      '#1e293b',
  text:      '#e2e8f0',
  dim:       '#475569',
}

// Assign a unique color per satellite from a fixed palette
const SAT_PALETTE = [
  '#60a5fa', '#a78bfa', '#34d399', '#fb923c',
  '#f472b6', '#facc15', '#38bdf8', '#4ade80',
  '#c084fc', '#f87171',
]

export function satColor(index) {
  return SAT_PALETTE[index % SAT_PALETTE.length]
}

// Orbit type color based on altitude
export function orbitColor(x, y, z) {
  const alt = altitude(x, y, z)
  if (alt < 2000)  return '#34d399'  // LEO  — green
  if (alt < 20000) return '#60a5fa'  // MEO  — blue
  return '#f472b6'                   // GEO+ — pink
}

// Orbit type label
// export function orbitType(x, y, z) {
//   const alt = altitude(x, y, z)
//   if (alt < 2000)  return 'LEO'
//   if (alt < 20000) return 'MEO'
//   if (alt < 42000) return 'GEO'
//   return 'HEO'
// }
