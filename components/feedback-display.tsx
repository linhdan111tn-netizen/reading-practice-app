"use client"

import { useState, useEffect } from "react"
import type { AnalysisResult } from "./reading-practice"
import { AlertCircle, Pause, Volume2, Star, Trophy, Target, TrendingUp } from "lucide-react"

interface FeedbackDisplayProps {
  analysis: AnalysisResult
  originalText: string
  recordedText: string
}

export function FeedbackDisplay({ analysis, originalText, recordedText }: FeedbackDisplayProps) {
  const [showCelebration, setShowCelebration] = useState(false)
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    if (analysis.isPerfect) {
      setShowCelebration(true)
      // Play celebration sound
      try {
        const audio = new Audio("/celebration.mp3")
        audio.volume = 0.5
        audio.play().catch(() => {})
      } catch {}
    } else {
      // Play celebration sound
      try {
        const audio = new Audio("/done.mp3")
        audio.volume = 0.5
        audio.play().catch(() => {})
      } catch {}
    }

    // Animate score
    const duration = 1500
    const steps = 30
    const increment = analysis.score / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= analysis.score) {
        setAnimatedScore(analysis.score)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.round(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [analysis])

  const getScoreColor = (score: number) => {
    if (score >= 90) return "from-green-400 to-emerald-500"
    if (score >= 70) return "from-blue-400 to-cyan-500"
    if (score >= 50) return "from-yellow-400 to-orange-500"
    return "from-orange-400 to-red-400"
  }

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🎉"
    if (score >= 70) return "😊"
    if (score >= 50) return "💪"
    return "🌱"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "XUẤT SẮC!"
    if (score >= 70) return "GIỎI LẮM!"
    if (score >= 50) return "KHÁ RỒI!"
    return "CỐ GẮNG THÊM NHÉ!"
  }

  const renderTextComparison = () => {
    if (!recordedText) return null

    const originalWords = originalText.toLowerCase().split(/\s+/)
    const recordedWords = recordedText.toLowerCase().split(/\s+/)

    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-indigo-200">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-8 h-8 text-indigo-500" />
          <h3 className="text-xl font-bold text-gray-800">So Sánh Bài Đọc</h3>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-sm font-semibold text-gray-500 mb-2">Bài mẫu:</p>
            <p className="text-gray-700 leading-relaxed">{originalText}</p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-sm font-semibold text-blue-600 mb-2">Con đã đọc:</p>
            <p className="text-gray-700 leading-relaxed">
              {recordedWords.map((word, idx) => {
                const isCorrect = originalWords.includes(word.replace(/[.,!?]/g, ""))
                return (
                  <span
                    key={idx}
                    className={`${isCorrect ? "text-green-600" : "text-red-500 bg-red-100 px-1 rounded"} mr-1`}
                  >
                    {word}
                  </span>
                )
              })}
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Đọc đúng
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              Cần sửa lại
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Score Card with Animation */}
      <div
        className={`bg-gradient-to-br ${getScoreColor(analysis.score)} rounded-3xl shadow-xl p-8 text-white text-center relative overflow-hidden`}
      >
        {/* Celebration particles */}
        {showCelebration && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  fontSize: `${Math.random() * 20 + 20}px`,
                }}
              >
                {["⭐", "🎉", "✨", "🌟", "💫"][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        )}

        {analysis.isPerfect && (
          <div className="mb-4 relative z-10">
            <Trophy className="w-16 h-16 mx-auto text-yellow-300 animate-bounce" />
          </div>
        )}

        <div className="text-8xl font-extrabold mb-2 relative z-10">
          {animatedScore}
          <span className="text-4xl opacity-80">/100</span>
        </div>

        <div className="text-4xl mb-4">{getScoreEmoji(analysis.score)}</div>

        <p className="text-2xl font-bold opacity-90 relative z-10">{getScoreMessage(analysis.score)}</p>

        {/* Progress indicator */}
        <div className="mt-6 bg-white/20 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-white/60 rounded-full transition-all duration-1000"
            style={{ width: `${analysis.score}%` }}
          ></div>
        </div>
      </div>

      {/* Feedback Message */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-yellow-200">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Lời Nhận Xét Của Cô</h3>
            <p className="text-lg text-gray-700 leading-relaxed">{analysis.feedback}</p>
          </div>
        </div>
      </div>

      {/* Text Comparison */}
      {recordedText && renderTextComparison()}

      {/* Mistakes Section */}
      {analysis.mistakes.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <h3 className="text-xl font-bold text-gray-800">Cần Sửa Lại</h3>
          </div>
          <div className="space-y-3">
            {analysis.mistakes.map((mistake, index) => (
              <div key={index} className="bg-red-50 rounded-2xl p-4 flex items-center gap-4">
                <span className="text-2xl">❌</span>
                <div className="flex-1">
                  <span className="font-bold text-red-600 text-lg">"{mistake.word}"</span>
                  <span className="mx-3 text-gray-400">→</span>
                  <span className="font-bold text-green-600 text-lg">"{mistake.suggestion}"</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pause Points */}
      {analysis.pausePoints.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <Pause className="w-8 h-8 text-blue-500" />
            <h3 className="text-xl font-bold text-gray-800">Chỗ Cần Ngắt Nghỉ</h3>
          </div>
          <p className="text-gray-600 mb-3">Dừng lại một chút ở những chỗ này nhé:</p>
          <div className="flex flex-wrap gap-2">
            {analysis.pausePoints.map((point, index) => (
              <span key={index} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-lg">
                ...{point} ⏸️
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Emphasis Words */}
      {analysis.emphasisWords.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <Volume2 className="w-8 h-8 text-green-500" />
            <h3 className="text-xl font-bold text-gray-800">Từ Cần Nhấn Giọng</h3>
          </div>
          <p className="text-gray-600 mb-3">Đọc to và rõ hơn ở những từ này:</p>
          <div className="flex flex-wrap gap-2">
            {analysis.emphasisWords.map((word, index) => (
              <span key={index} className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-lg">
                🔊 {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Perfect Score Celebration */}
      {analysis.isPerfect && (
        <div className="bg-gradient-to-r from-yellow-100 via-pink-100 to-blue-100 rounded-3xl p-8 text-center border-4 border-yellow-300">
          <div className="text-5xl mb-4 space-x-2">
            <span className="inline-block animate-bounce" style={{ animationDelay: "0s" }}>
              🎊
            </span>
            <span className="inline-block animate-bounce" style={{ animationDelay: "0.1s" }}>
              🎉
            </span>
            <span className="inline-block animate-bounce" style={{ animationDelay: "0.2s" }}>
              🥳
            </span>
            <span className="inline-block animate-bounce" style={{ animationDelay: "0.3s" }}>
              🎊
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-500 to-blue-500 mb-4">
            HOÀN HẢO! CON TUYỆT VỜI!
          </h3>
          <p className="text-xl text-gray-700">Con đã được thưởng 1 sticker mới! 🌟</p>
          <div className="mt-4 flex justify-center gap-2">
            {["⭐", "🌟", "✨", "💫", "🏆"].map((emoji, i) => (
              <span key={i} className="text-3xl animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                {emoji}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Tips */}
      {analysis.score < 90 && (
        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <h3 className="text-xl font-bold text-gray-800">Mẹo Để Đọc Tốt Hơn</h3>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span>💡</span>
              <span>Đọc chậm và rõ ràng từng từ</span>
            </li>
            <li className="flex items-start gap-2">
              <span>💡</span>
              <span>Nhớ ngắt nghỉ ở dấu phẩy và dấu chấm</span>
            </li>
            <li className="flex items-start gap-2">
              <span>💡</span>
              <span>Giữ micro gần miệng hơn khi đọc</span>
            </li>
            <li className="flex items-start gap-2">
              <span>💡</span>
              <span>Nghe lại giọng mẫu và đọc theo</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
