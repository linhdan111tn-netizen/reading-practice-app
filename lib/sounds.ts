export const SOUNDS = {
  done: "/done.mp3",
  perfect: "/celebration.mp3",
} as const

export type SoundKey = keyof typeof SOUNDS
