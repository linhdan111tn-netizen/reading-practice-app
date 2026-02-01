"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Mic, Square, Play, Pause, RotateCcw, AlertTriangle } from "lucide-react"
import { transcribeFromBlob, sendToWhisper, sendToWhisperHost } from "@/lib/audio"


interface VoiceRecorderProps {
  isRecording: boolean
  onRecordingChange: (isRecording: boolean) => void
  onRecordingComplete: (text: string) => void
  disabled?: boolean
}

export function VoiceRecorder({ isRecording, onRecordingChange, onRecordingComplete, disabled }: VoiceRecorderProps) {
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [recognitionSupported, setRecognitionSupported] = useState(true)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [showManualInput, setShowManualInput] = useState(false)
  const [manualText, setManualText] = useState("")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<any>(null)
  const allTranscriptsRef = useRef<string[]>([])
  const isRecordingRef = useRef(false)

  const startRecording = async () => {
    try {
      setPermissionDenied(false)
      setShowManualInput(false)

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      })

      // ✅ Safari / iOS fallback
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4"

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType })
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType,
        })

        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)

        console.log("Audio URL:", url)

        try {
          // 🔥 GỌI WHISPER BACKEND
          const text = await sendToWhisperHost(audioBlob)

          if (text && text.trim()) {
            setTranscript(text)
            onRecordingComplete(text)
          } else {
            setShowManualInput(true)
          }
        } catch (e) {
          console.log("Transcribe error:", e)
          setShowManualInput(true)
        } finally {
          stream.getTracks().forEach((track) => track.stop())
        }
      }

      mediaRecorderRef.current.start()
      onRecordingChange(true)
      isRecordingRef.current = true
      setRecordingTime(0)
      setTranscript("")
      setInterimTranscript("")
      allTranscriptsRef.current = []

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

    } catch (err) {
      console.log("[v0] Microphone error:", err)
      setPermissionDenied(true)
    }
  }

  const stopRecording = useCallback(() => {
    isRecordingRef.current = false

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }

    onRecordingChange(false)

    setTimeout(() => {

      console.log(transcript)

      // Kết hợp tất cả transcripts đã thu được
      // const combinedText = allTranscriptsRef.current.join(" ").trim() || transcript || interimTranscript

      // console.log(combinedText)

      // if (combinedText.trim()) {
      //   setTranscript(combinedText)
      //   onRecordingComplete(combinedText.trim())
      // } else {
      //   setShowManualInput(true)
      // }
    }, 1200)
  }, [onRecordingChange, onRecordingComplete, transcript, interimTranscript])

  const handleManualSubmit = () => {
    if (manualText.trim()) {
      setTranscript(manualText.trim())
      onRecordingComplete(manualText.trim())
      setShowManualInput(false)
      setManualText("")
    }
  }

  const playRecording = () => {
    if (audioURL && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const resetRecording = () => {
    setAudioURL(null)
    setTranscript("")
    setInterimTranscript("")
    setRecordingTime(0)
    setShowManualInput(false)
    setManualText("")
    allTranscriptsRef.current = []
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!recognitionSupported) {
    return (
      <div className="bg-yellow-50 rounded-2xl p-6 text-center border-2 border-yellow-200">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
        <p className="text-yellow-700 font-medium text-lg">Trình duyệt chưa hỗ trợ nhận dạng giọng nói.</p>
        <p className="text-yellow-600 mt-2">Vui lòng sử dụng Chrome hoặc Edge trên máy tính!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {permissionDenied && (
        <div className="bg-red-50 rounded-2xl p-4 text-center border-2 border-red-200">
          <p className="text-red-600 font-medium">Vui lòng cho phép truy cập microphone trong cài đặt trình duyệt!</p>
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={disabled}
            className={`w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition-all ${
              disabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-br from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 transform hover:scale-110 animate-pulse"
            }`}
          >
            <Mic className="w-14 h-14 text-white" />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            <Square className="w-14 h-14 text-white fill-white animate-pulse" />
          </button>
        )}

        {isRecording && (
          <div className="flex items-center gap-3 bg-red-100 px-6 py-3 rounded-full">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-3xl font-bold text-red-600">{formatTime(recordingTime)}</span>
          </div>
        )}

        <p className="text-gray-600 font-semibold text-center text-lg">
          {isRecording
            ? "Hãy đọc to và rõ ràng - Nhấn để dừng"
            : disabled
              ? "Nghe mẫu trước khi ghi âm nhé!"
              : "Nhấn vào micro để bắt đầu ghi âm"}
        </p>

        {!isRecording && !disabled && (
          <p className="text-sm text-gray-400 text-center">Mẹo: Đọc to, rõ ràng và giữ micro gần miệng</p>
        )}
      </div>

      {/* Live transcript while recording */}
      {isRecording && (transcript || interimTranscript) && (
        <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
          <p className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
            Đang nghe con đọc:
          </p>
          <p className="text-gray-700 text-lg">
            <span className="text-blue-700">{transcript}</span>
            <span className="text-gray-400 italic"> {interimTranscript}</span>
          </p>
        </div>
      )}

      {/* Manual input fallback */}
      {showManualInput && (
        <div className="bg-orange-50 rounded-2xl p-5 border-2 border-orange-200 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-orange-700">Ồ! Cô chưa nghe rõ con đọc gì</p>
              <p className="text-orange-600 text-sm mt-1">Hãy gõ lại những gì con vừa đọc để cô chấm điểm nhé!</p>
            </div>
          </div>
          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Gõ lại bài con vừa đọc vào đây..."
            className="w-full p-4 rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none text-lg resize-none"
            rows={3}
          />
          <div className="flex gap-3">
            <button
              onClick={handleManualSubmit}
              disabled={!manualText.trim()}
              className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              Gửi để chấm điểm
            </button>
            <button
              onClick={() => {
                setShowManualInput(false)
                resetRecording()
              }}
              className="bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-300 transition-all"
            >
              Ghi âm lại
            </button>
          </div>
        </div>
      )}

      {/* Playback controls */}
      {audioURL && !isRecording && !showManualInput && (
        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border-2 border-gray-200">
          <button
            onClick={playRecording}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
          >
            {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
          </button>
          <div className="flex-1">
            <p className="font-semibold text-gray-800">Bản ghi âm của con</p>
            <p className="text-sm text-gray-500">Nhấn để nghe lại</p>
          </div>
          <button
            onClick={resetRecording}
            className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all"
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
          </button>
          <audio ref={audioRef} src={audioURL} onEnded={() => setIsPlaying(false)} className="hidden" />
        </div>
      )}

      {/* Final transcript display */}
      {transcript && !isRecording && !showManualInput && (
        <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
          <p className="font-semibold text-green-800 mb-2">Con đã đọc:</p>
          <p className="text-gray-700 text-lg leading-relaxed">{transcript}</p>
        </div>
      )}
    </div>
  )
}
