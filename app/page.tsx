"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { DifficultySelector } from "@/components/difficulty-selector"
import { ReadingPractice } from "@/components/reading-practice"
import { StickerCollection } from "@/components/sticker-collection"
import { CustomTextInput } from "@/components/custom-text-input"
import { Confetti } from "@/components/confetti"

export type Difficulty = "easy" | "medium" | "hard"

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"home" | "practice" | "stickers" | "custom">("home")
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("easy")
  const [customText, setCustomText] = useState("")
  const [stickers, setStickers] = useState<string[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [totalScore, setTotalScore] = useState(0)

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty)
    setCustomText("")
    setCurrentView("practice")
  }

  const handleCustomPractice = (text: string) => {
    setCustomText(text)
    setSelectedDifficulty("easy")
    setCurrentView("practice")
  }

  const handleEarnSticker = (sticker: string) => {
    if (!stickers.includes(sticker)) {
      setStickers([...stickers, sticker])
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }

  const handleScoreUpdate = (score: number) => {
    setTotalScore((prev) => prev + score)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-pink-50 to-blue-100 overflow-x-hidden">
      {showConfetti && <Confetti />}

      <Header
        stickerCount={stickers.length}
        totalScore={totalScore}
        onViewStickers={() => setCurrentView("stickers")}
        onGoHome={() => setCurrentView("home")}
      />

      <main className="container mx-auto px-4 py-6 pb-24">
        {currentView === "home" && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-blue-500 to-pink-500 animate-bounce-slow">
                🎤 Luyện Đọc tốt hơn mỗi ngày
              </h1>
              <p className="text-lg text-gray-600 font-medium">Cùng luyện đọc và nhận sticker thưởng nhé! ⭐</p>
            </div>

            <DifficultySelector onSelect={handleSelectDifficulty} />

            <div className="flex justify-center">
              <button
                onClick={() => setCurrentView("custom")}
                className="bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-3 text-lg"
              >
                <span className="text-2xl">✏️</span>
                Tự Viết Bài Luyện Đọc
              </button>
            </div>
          </div>
        )}

        {currentView === "practice" && (
          <ReadingPractice
            difficulty={selectedDifficulty}
            customText={customText}
            onBack={() => setCurrentView("home")}
            onEarnSticker={handleEarnSticker}
            onScoreUpdate={handleScoreUpdate}
          />
        )}

        {currentView === "stickers" && (
          <StickerCollection stickers={stickers} totalScore={totalScore} onBack={() => setCurrentView("home")} />
        )}

        {currentView === "custom" && (
          <CustomTextInput onSubmit={handleCustomPractice} onBack={() => setCurrentView("home")} />
        )}
      </main>
    </div>
  )
}
