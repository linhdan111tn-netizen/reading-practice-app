"use client"

import { useState, useCallback } from "react"
import type { Difficulty } from "@/app/page"
import { VoiceRecorder } from "./voice-recorder"
import { SampleVoice } from "./sample-voice"
import { FeedbackDisplay } from "./feedback-display"
import { ArrowLeft, RefreshCw, ChevronRight, ChevronLeft, List, BookOpen, Sparkles } from "lucide-react"
import { readingTexts } from "@/lib/reading-data"
import { analyzeReading } from "@/lib/analyze-reading"

interface ReadingPracticeProps {
  difficulty: Difficulty
  customText: string
  onBack: () => void
  onEarnSticker: (sticker: string) => void
  onScoreUpdate: (score: number) => void
}

export interface AnalysisResult {
  score: number
  feedback: string
  mistakes: { word: string; suggestion: string }[]
  pausePoints: string[]
  emphasisWords: string[]
  isPerfect: boolean
}

export function ReadingPractice({
  difficulty,
  customText,
  onBack,
  onEarnSticker,
  onScoreUpdate,
}: ReadingPracticeProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedText, setRecordedText] = useState("")
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasListenedSample, setHasListenedSample] = useState(false)
  const [showTextSelector, setShowTextSelector] = useState(false)

  const texts = customText ? [customText] : readingTexts[difficulty]
  const currentText = texts[currentTextIndex]

  const handleRecordingComplete = useCallback(
    async (text: string) => {
      setRecordedText(text)
      setIsAnalyzing(true)

      try {
        const result = await analyzeReading(currentText, text)
        setAnalysis(result)
        onScoreUpdate(result.score)

        if (result.score >= 90) {
          const stickers = [
            "⭐",
            "🌟",
            "🎖️",
            "🏅",
            "🥇",
            "🎯",
            "💎",
            "👑",
            "🦋",
            "🌈",
            "🎪",
            "🎨",
            "🎸",
            "🎭",
            "🌻",
            "🍀",
            "🚀",
            "🎠",
            "🎡",
            "🦄",
            "🐬",
            "🦁",
            "🐼",
            "🦊",
          ]
          const randomSticker = stickers[Math.floor(Math.random() * stickers.length)]
          onEarnSticker(randomSticker)
        }
      } catch (err) {
        setAnalysis({
          score: 0,
          feedback: "Có lỗi xảy ra, hãy thử lại nhé!",
          mistakes: [],
          pausePoints: [],
          emphasisWords: [],
          isPerfect: false,
        })
      } finally {
        setIsAnalyzing(false)
      }
    },
    [currentText, onScoreUpdate, onEarnSticker],
  )

  const handleSelectText = (index: number) => {
    setCurrentTextIndex(index)
    setRecordedText("")
    setAnalysis(null)
    setHasListenedSample(false)
    setShowTextSelector(false)
  }

  const handleNextText = () => {
    setCurrentTextIndex((prev) => (prev + 1) % texts.length)
    setRecordedText("")
    setAnalysis(null)
    setHasListenedSample(false)
  }

  const handlePrevText = () => {
    setCurrentTextIndex((prev) => (prev - 1 + texts.length) % texts.length)
    setRecordedText("")
    setAnalysis(null)
    setHasListenedSample(false)
  }

  const handleRetry = () => {
    setRecordedText("")
    setAnalysis(null)
  }

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case "easy":
        return { label: "Dễ", emoji: "🌱", color: "text-green-600" }
      case "medium":
        return { label: "Trung Bình", emoji: "🌿", color: "text-blue-600" }
      case "hard":
        return { label: "Khó", emoji: "🌳", color: "text-purple-600" }
    }
  }

  const diffInfo = getDifficultyLabel()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors font-semibold bg-white px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        {!customText && (
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`${diffInfo.color} font-bold flex items-center gap-1 bg-white px-4 py-2 rounded-full shadow-sm`}
            >
              {diffInfo.emoji} Cấp độ: {diffInfo.label}
            </span>
            <button
              onClick={() => setShowTextSelector(!showTextSelector)}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full font-semibold transition-all shadow-md"
            >
              <List className="w-4 h-4" />
              Chọn Bài ({currentTextIndex + 1}/{texts.length})
            </button>
          </div>
        )}
      </div>

      {/* Text Selector Panel */}
      {showTextSelector && !customText && (
        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-purple-200 animate-fadeIn">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-500" />
            Chọn Bài Đọc - {diffInfo.emoji} {diffInfo.label}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
            {texts.map((text, index) => (
              <button
                key={index}
                onClick={() => handleSelectText(index)}
                className={`text-left p-4 rounded-2xl transition-all transform hover:scale-102 ${
                  index === currentTextIndex
                    ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-102"
                    : "bg-purple-50 hover:bg-purple-100 text-gray-700 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-lg font-bold ${index === currentTextIndex ? "text-white" : "text-purple-600"}`}
                  >
                    Bài {index + 1}
                  </span>
                  {index === currentTextIndex && <Sparkles className="w-4 h-4" />}
                </div>
                <p
                  className={`text-sm line-clamp-2 ${index === currentTextIndex ? "text-purple-100" : "text-gray-500"}`}
                >
                  {text.substring(0, 80)}...
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reading Text Card */}
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border-4 border-yellow-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📖</span>
            <h2 className="text-2xl font-bold text-gray-800">Bài Đọc</h2>
          </div>

          {!customText && texts.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevText}
                className="w-10 h-10 rounded-full bg-yellow-100 hover:bg-yellow-200 flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-yellow-700" />
              </button>
              <span className="font-bold text-gray-600 min-w-[60px] text-center">
                {currentTextIndex + 1}/{texts.length}
              </span>
              <button
                onClick={handleNextText}
                className="w-10 h-10 rounded-full bg-yellow-100 hover:bg-yellow-200 flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5 text-yellow-700" />
              </button>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 mb-6 border-2 border-yellow-100">
          <p className="text-xl md:text-2xl leading-relaxed text-gray-800 font-medium whitespace-pre-line">
            {currentText}
          </p>
        </div>

        <SampleVoice text={currentText} onListened={() => setHasListenedSample(true)} />
      </div>

      {/* Recording Section */}
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border-4 border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🎤</span>
          <h2 className="text-2xl font-bold text-gray-800">Ghi Âm Của Con</h2>
        </div>

        <VoiceRecorder
          isRecording={isRecording}
          onRecordingChange={setIsRecording}
          onRecordingComplete={handleRecordingComplete}
          disabled={!hasListenedSample && !customText}
        />

        {!hasListenedSample && !customText && (
          <p className="text-center text-orange-600 font-medium mt-4 bg-orange-50 rounded-xl py-3 px-4 border-2 border-orange-200">
            Hãy nghe mẫu trước khi ghi âm nhé!
          </p>
        )}
      </div>

      {/* Analysis Loading */}
      {isAnalyzing && (
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center border-4 border-blue-200">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-3xl">📝</div>
          </div>
          <p className="text-xl font-bold text-blue-600">Đang chấm điểm bài đọc...</p>
          <p className="text-gray-500 mt-2">Chờ cô giáo một chút nhé!</p>
        </div>
      )}

      {/* Feedback Display */}
      {analysis && !isAnalyzing && (
        <FeedbackDisplay analysis={analysis} originalText={currentText} recordedText={recordedText} />
      )}

      {/* Action Buttons */}
      {analysis && !isAnalyzing && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetry}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Đọc Lại Bài Này
          </button>

          {!customText && (
            <button
              onClick={handleNextText}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Bài Tiếp Theo
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
