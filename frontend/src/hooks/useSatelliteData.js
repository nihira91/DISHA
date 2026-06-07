import { useState, useEffect } from 'react'
import { altitude, orbitType } from '../utils/coords'


export function useSatelliteData() {
  const [satellites, setSatellites] = useState([])
  const [meta, setMeta]             = useState({ mae_km: 0, rmse_km: 0 })
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        const enriched = data.satellites.map((sat, idx) => {
          // Last known position (end of actual track)
          const lastPos  = sat.actual[sat.actual.length - 1]
          const alt      = altitude(...lastPos)
          const orbit    = orbitType(...lastPos)

          return {
            ...sat,
            index:    idx,
            altitude: Math.round(alt),
            orbit,
            // total future steps available
            futureLen: sat.future?.length ?? 0,
          }
        })

        setMeta({ mae_km: data.mae_km, rmse_km: data.rmse_km })
        setSatellites(enriched)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { satellites, meta, loading, error }
}
