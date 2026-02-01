"use client"

import { Star, Trophy, Home } from "lucide-react"

interface HeaderProps {
  stickerCount: number
  totalScore: number
  onViewStickers: () => void
  onGoHome: () => void
}

export function Header({ stickerCount, totalScore, onViewStickers, onGoHome }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
        >
          <Home className="w-6 h-6" />
          <span className="font-bold text-lg hidden sm:inline">Trang Chủ</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span className="font-bold text-yellow-700">{totalScore}</span>
          </div>

          <button
            onClick={onViewStickers}
            className="flex items-center gap-2 bg-pink-100 px-4 py-2 rounded-full hover:bg-pink-200 transition-colors"
          >
            <Star className="w-5 h-5 text-pink-600 fill-pink-600" />
            <span className="font-bold text-pink-700">{stickerCount} Sticker</span>
          </button>
        </div>
      </div>
    </header>
  )
}
