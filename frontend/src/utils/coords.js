import * as THREE from 'three'

export const EARTH_RADIUS_KM = 6371
export const SCALE           = 0.001

export function eciToThree(x, y, z) {
  return new THREE.Vector3(
    x * SCALE,
    z * SCALE,
    -y * SCALE
  )
}

export function orbitalRadius(x, y, z) {
  return Math.sqrt(x * x + y * y + z * z)
}

export function altitude(x, y, z) {
  return orbitalRadius(x, y, z) - EARTH_RADIUS_KM
}

export function eciToGeo(x, y, z) {
  const r   = Math.sqrt(x * x + y * y + z * z)
  const lat = Math.asin(z / r) * (180 / Math.PI)
  const lng = Math.atan2(y, x) * (180 / Math.PI)
  const alt = r - EARTH_RADIUS_KM
  return { lat, lng, alt }
}

export function distanceKm(a, b) {
  const dx = a[0] - b[0]
  const dy = a[1] - b[1]
  const dz = a[2] - b[2]
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

export function orbitType(x, y, z) {
  const alt = altitude(x, y, z)
  if (alt < 2000)  return 'LEO'
  if (alt < 20000) return 'MEO'
  if (alt < 42000) return 'GEO'
  return 'HEO'
}