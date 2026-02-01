"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX, User, UserRound, AlertCircle } from "lucide-react"

interface SampleVoiceProps {
  text: string
  onListened: () => void
}

type VoiceGender = "male" | "female"

export function SampleVoice({ text, onListened }: SampleVoiceProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<VoiceGender>("female")
  const [hasListened, setHasListened] = useState(false)
  const [voicesLoaded, setVoicesLoaded] = useState(false)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [speechSupported, setSpeechSupported] = useState(true)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSpeechSupported(false)
      return
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        setAvailableVoices(voices)
        setVoicesLoaded(true)
      }
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  useEffect(() => {
    setHasListened(false)
  }, [text])

  const getVoiceForGender = (gender: VoiceGender): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices()

    // Ưu tiên giọng Việt
    const vietnameseVoices = voices.filter(v =>
      v.lang === "vi-VN"
    )

    if (gender === "female") {
      return vietnameseVoices.find(v =>
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("nu") ||
        v.name.toLowerCase().includes("linh")
      ) || vietnameseVoices[0]
    }

    return vietnameseVoices.find(v =>
      v.name.toLowerCase().includes("male") ||
      v.name.toLowerCase().includes("nam")
    ) || vietnameseVoices[0]
  }

  const speak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("Trình duyệt không hỗ trợ đọc văn bản!")
      return
    }

    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "vi-VN"
    utterance.rate = 0.85
    utterance.volume = 1

    // Set pitch based on gender selection
    if (selectedVoice === "female") {
      utterance.pitch = 1.1 // 👈 GIỌNG NỮ DỄ NGHE
    } else {
      utterance.pitch = 0.95  // 👈 GIỌNG NAM TRẦM ỔN
    }

    // Try to use Vietnamese voice if available
    const voice = getVoiceForGender(selectedVoice)
    if (voice) {
      utterance.voice = voice
    }

    utterance.onstart = () => {
      setIsPlaying(true)
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setHasListened(true)
      onListened()
    }

    utterance.onerror = (event) => {
      console.log("[v0] Speech error:", event.error)
      setIsPlaying(false)
      // Still mark as listened if there was an error so user can proceed
      if (event.error !== "canceled") {
        setHasListened(true)
        onListened()
      }
    }

    utteranceRef.current = utterance

    // Small delay to ensure speech synthesis is ready
    setTimeout(() => {
      window.speechSynthesis.speak(utterance)
    }, 100)
  }

  const handleSkipListening = () => {
    setHasListened(true)
    onListened()
  }

  if (!speechSupported) {
    return (
      <div className="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-200">
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="w-6 h-6 text-yellow-600" />
          <p className="font-medium text-yellow-700">Trình duyệt không hỗ trợ đọc mẫu</p>
        </div>
        <button
          onClick={handleSkipListening}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
        >
          Bỏ qua và ghi âm luôn
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">

      <div className="flex justify-center">
        <button
          onClick={speak}
          disabled={!voicesLoaded}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
            isPlaying
              ? "bg-gradient-to-r from-orange-400 to-red-500 text-white"
              : hasListened
                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                : "bg-gradient-to-r from-blue-400 to-indigo-500 text-white"
          }`}
        >
          {isPlaying ? (
            <>
              <VolumeX className="w-7 h-7 animate-pulse" />
              Dừng Đọc Mẫu
            </>
          ) : (
            <>
              <Volume2 className={`w-7 h-7 ${!hasListened ? "animate-bounce" : ""}`} />
              {hasListened ? "Nghe Lại Mẫu" : "Nghe Đọc Mẫu"}
            </>
          )}
        </button>
      </div>

      {isPlaying && (
        <div className="flex justify-center">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 20 + 15}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {hasListened && !isPlaying && (
        <p className="text-center text-green-600 font-semibold bg-green-50 rounded-xl py-3 border-2 border-green-200 animate-fadeIn">
          Tuyệt vời! Giờ con có thể ghi âm được rồi!
        </p>
      )}

      {!hasListened && !isPlaying && (
        <p className="text-center text-blue-600 font-medium text-sm">
          Nhấn nút để nghe {selectedVoice === "female" ? "cô" : "thầy"} đọc mẫu trước nhé!
        </p>
      )}
    </div>
  )
}
