"use client"

import type { Difficulty } from "@/app/page"
import { Sparkles, BookOpen, GraduationCap } from "lucide-react"

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void
}

const difficulties = [
  {
    id: "easy" as Difficulty,
    label: "Dễ",
    description: "2-3 câu ngắn",
    icon: Sparkles,
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50",
    emoji: "🌟",
  },
  {
    id: "medium" as Difficulty,
    label: "Trung Bình",
    description: "2-3 đoạn văn",
    icon: BookOpen,
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-50",
    emoji: "📚",
  },
  {
    id: "hard" as Difficulty,
    label: "Khó",
    description: "Bài văn, bài thơ",
    icon: GraduationCap,
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50",
    emoji: "🏆",
  },
]

export function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {difficulties.map((diff) => (
        <button
          key={diff.id}
          onClick={() => onSelect(diff.id)}
          className={`${diff.bgColor} p-6 rounded-3xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all group border-4 border-white`}
        >
          <div
            className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${diff.color} flex items-center justify-center mb-4 group-hover:animate-wiggle`}
          >
            <span className="text-4xl">{diff.emoji}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{diff.label}</h3>
          <p className="text-gray-600 font-medium">{diff.description}</p>
        </button>
      ))}
    </div>
  )
}
