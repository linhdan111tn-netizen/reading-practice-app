// lib/audio/AudioManager.ts

import { SOUNDS, SoundKey } from "./sounds"

class AudioManager {
  private unlocked = false
  private audios: Partial<Record<SoundKey, HTMLAudioElement>> = {}

  /** 🔓 GỌI 1 LẦN DUY NHẤT từ click user */
  unlock() {
    if (this.unlocked) return
    this.unlocked = true

    // unlock autoplay policy
    const audio = new Audio()
    audio.play().catch(() => {})
  }

  /** 🔊 Phát âm thanh hệ thống */
  play(key: SoundKey, volume = 0.5) {
    if (!this.unlocked) return

    if (!this.audios[key]) {
      const audio = new Audio(SOUNDS[key])
      audio.preload = "auto"
      this.audios[key] = audio
    }

    const audio = this.audios[key]!
    audio.currentTime = 0
    audio.volume = volume
    audio.play().catch(() => {})
  }

  /** ⛔ Dừng tất cả (nếu cần) */
  stopAll() {
    Object.values(this.audios).forEach((audio) => {
      if (!audio) return
      audio.pause()
      audio.currentTime = 0
    })
  }
}

export const audioManager = new AudioManager()
