import { useRef, useCallback } from "react"

export function useAudioUnlock() {
  const unlockedRef = useRef(false)

  const unlockAudio = useCallback(() => {
    if (unlockedRef.current) return

    try {
      const audio = new Audio()
      audio.volume = 0
      audio.play().catch(() => {})
      unlockedRef.current = true
    } catch {}
  }, [])

  const playSound = useCallback((src: string, volume = 0.5) => {
    if (!unlockedRef.current) return

    try {
      const audio = new Audio(src)
      audio.volume = volume
      audio.play().catch(() => {})
    } catch {}
  }, [])

  return {
    unlockAudio,   // gọi 1 lần khi user click
    playSound,     // dùng ở mọi logic
    isUnlocked: unlockedRef.current
  }
}
