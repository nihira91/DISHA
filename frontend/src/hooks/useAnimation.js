import { useState, useEffect, useRef, useCallback } from 'react'

export function useAnimation(maxSteps, fps = 10) {
  const [currentStep, setCurrentStep] = useState(0)
  const [playing, setPlaying]         = useState(false)
  const rafRef                        = useRef(null)
  const lastTimeRef                   = useRef(null)
  const interval                      = 1000 / fps

  const tick = useCallback((timestamp) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp
    const elapsed = timestamp - lastTimeRef.current

    if (elapsed >= interval) {
      lastTimeRef.current = timestamp
      setCurrentStep(s => {
        if (s >= maxSteps - 1) {
          setPlaying(false)
          return s
        }
        return s + 1
      })
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [interval, maxSteps])

  useEffect(() => {
    if (playing) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastTimeRef.current = null
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [playing, tick])

  const play    = () => setPlaying(true)
  const pause   = () => setPlaying(false)
  const reset   = () => { setPlaying(false); setCurrentStep(0) }
  const seek    = (step) => setCurrentStep(Math.max(0, Math.min(step, maxSteps - 1)))

  return { currentStep, playing, play, pause, reset, seek }
}
