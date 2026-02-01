"use client"

import { ArrowLeft, Gift, Trophy, Sparkles, Star } from "lucide-react"

interface StickerCollectionProps {
  stickers: string[]
  totalScore: number
  onBack: () => void
}

const allStickers = [
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
  "🎭",
  "🎸",
  "🎠",
  "🎡",
  "🦄",
  "🐬",
  "🦁",
  "🐼",
  "🦊",
  "🐰",
  "🌸",
  "🌺",
  "🍀",
  "🌻",
  "🚀",
  "🎈",
  "🎁",
  "🎀",
  "🏆",
  "🎵",
]

const rewards = [
  { stickers: 3, gift: "Huy hiệu Bạc", emoji: "🥈" },
  { stickers: 6, gift: "Huy hiệu Vàng", emoji: "🥇" },
  { stickers: 10, gift: "Phần quà bí ẩn", emoji: "🎁" },
  { stickers: 15, gift: "Siêu sao đọc sách", emoji: "⭐" },
  { stickers: 20, gift: "Vương miện đọc hay", emoji: "👑" },
  { stickers: 25, gift: "Quán quân luyện đọc", emoji: "🏆" },
]

export function StickerCollection({ stickers, totalScore, onBack }: StickerCollectionProps) {
  const nextReward = rewards.find((r) => r.stickers > stickers.length) || rewards[rewards.length - 1]
  const progress = stickers.length >= nextReward.stickers ? 100 : (stickers.length / nextReward.stickers) * 100

  const getLevel = () => {
    if (stickers.length >= 25) return { name: "Siêu Sao", color: "from-yellow-400 to-amber-500" }
    if (stickers.length >= 15) return { name: "Xuất Sắc", color: "from-purple-400 to-pink-500" }
    if (stickers.length >= 10) return { name: "Giỏi", color: "from-blue-400 to-indigo-500" }
    if (stickers.length >= 5) return { name: "Khá", color: "from-green-400 to-emerald-500" }
    return { name: "Mới Bắt Đầu", color: "from-gray-400 to-gray-500" }
  }

  const level = getLevel()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors font-semibold bg-white px-4 py-2 rounded-full shadow-sm"
      >
        <ArrowLeft className="w-5 h-5" />
        Quay lại
      </button>

      {/* Stats Card */}
      <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 text-6xl opacity-20 animate-float">🌟</div>
        <div className="absolute bottom-4 left-4 text-4xl opacity-20 animate-float" style={{ animationDelay: "1s" }}>
          ⭐
        </div>

        <div className="flex items-center justify-center gap-4 mb-6 relative z-10">
          <Trophy className="w-12 h-12" />
          <h2 className="text-3xl font-extrabold">Thành Tích Của Con</h2>
        </div>

        {/* Level Badge */}
        <div className="flex justify-center mb-6">
          <div className={`bg-gradient-to-r ${level.color} px-6 py-2 rounded-full shadow-lg`}>
            <span className="font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Cấp độ: {level.name}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 relative z-10">
          <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center">
            <div className="text-5xl font-extrabold">{stickers.length}</div>
            <div className="text-xl font-semibold flex items-center justify-center gap-2">
              <Star className="w-5 h-5" /> Sticker
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center">
            <div className="text-5xl font-extrabold">{totalScore}</div>
            <div className="text-xl font-semibold">Tổng Điểm</div>
          </div>
        </div>
      </div>

      {/* Progress to Next Reward */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-pink-200">
        <div className="flex items-center gap-3 mb-4">
          <Gift className="w-8 h-8 text-pink-500" />
          <h3 className="text-xl font-bold text-gray-800">Phần Thưởng Tiếp Theo</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-semibold">
              {stickers.length} / {nextReward.stickers} sticker
            </span>
            <span className="text-pink-600 font-bold flex items-center gap-2">
              <span className="text-2xl">{nextReward.emoji}</span>
              {nextReward.gift}
            </span>
          </div>
          <div className="h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-pink-400 via-rose-500 to-red-500 transition-all duration-500 rounded-full flex items-center justify-end pr-2"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {progress >= 20 && <span className="text-white text-xs font-bold">{Math.round(progress)}%</span>}
            </div>
          </div>
          {stickers.length < nextReward.stickers && (
            <p className="text-center text-gray-500 text-sm">
              Còn {nextReward.stickers - stickers.length} sticker nữa để nhận quà!
            </p>
          )}
        </div>
      </div>

      {/* Sticker Collection */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-yellow-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Bộ Sưu Tập Sticker</h3>
        <p className="text-center text-gray-500 mb-6">
          Đã sưu tập: {stickers.length} / {allStickers.length}
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {allStickers.map((sticker, index) => {
            const isCollected = stickers.includes(sticker)
            return (
              <div
                key={index}
                className={`aspect-square rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all ${
                  isCollected
                    ? "bg-gradient-to-br from-yellow-100 to-orange-100 shadow-lg hover:scale-110 cursor-pointer"
                    : "bg-gray-100 grayscale opacity-30"
                }`}
                style={
                  isCollected ? { animation: `float 3s ease-in-out infinite`, animationDelay: `${index * 0.1}s` } : {}
                }
              >
                {sticker}
              </div>
            )
          })}
        </div>
        <div className="mt-6 bg-blue-50 rounded-2xl p-4 text-center border-2 border-blue-200">
          <p className="text-blue-700 font-semibold">Mẹo: Đọc đạt 90 điểm trở lên để nhận sticker mới!</p>
        </div>
      </div>

      {/* Rewards List */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-green-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
          <Gift className="w-7 h-7 text-green-500" />
          Danh Sách Quà Thưởng
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rewards.map((reward, index) => {
            const isUnlocked = stickers.length >= reward.stickers
            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  isUnlocked
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 shadow-md"
                    : "bg-gray-50 border-2 border-gray-200"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                    isUnlocked ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg" : "bg-gray-200"
                  }`}
                >
                  {isUnlocked ? reward.emoji : "🔒"}
                </div>
                <div className="flex-1">
                  <div className={`font-bold text-lg ${isUnlocked ? "text-green-700" : "text-gray-500"}`}>
                    {reward.gift}
                  </div>
                  <div className="text-sm text-gray-500">{reward.stickers} sticker</div>
                </div>
                {isUnlocked && (
                  <div className="text-green-500 font-bold text-sm bg-green-100 px-3 py-1 rounded-full">Đã mở!</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Encouragement */}
      {stickers.length === 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 text-center border-4 border-blue-200">
          <div className="text-5xl mb-4">🌱</div>
          <h3 className="text-xl font-bold text-blue-700 mb-2">Bắt đầu sưu tập sticker nào!</h3>
          <p className="text-blue-600">Hãy luyện đọc và đạt điểm cao để nhận sticker đầu tiên nhé!</p>
        </div>
      )}
    </div>
  )
}
