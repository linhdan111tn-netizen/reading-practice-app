"use client"

import { useState } from "react"
import { ArrowLeft, Sparkles } from "lucide-react"

interface CustomTextInputProps {
  onSubmit: (text: string) => void
  onBack: () => void
}

export function CustomTextInput({ onSubmit, onBack }: CustomTextInputProps) {
  const [text, setText] = useState("")

  const handleSubmit = () => {
    if (text.trim().length < 10) {
      alert("Hãy nhập ít nhất 10 ký tự nhé!")
      return
    }
    onSubmit(text.trim())
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Quay lại
      </button>

      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border-4 border-orange-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">✏️</span>
          <h2 className="text-2xl font-bold text-gray-800">Viết Bài Luyện Đọc</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-orange-50 rounded-2xl p-4">
            <p className="text-orange-700 font-medium">
              💡 Gợi ý: Con có thể viết câu chuyện, bài thơ, hoặc bất kỳ đoạn văn nào con muốn luyện đọc!
            </p>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập bài đọc của con vào đây...&#10;&#10;Ví dụ: Hôm nay trời đẹp quá! Mình sẽ ra công viên chơi với các bạn."
            className="w-full h-64 p-6 text-lg border-4 border-orange-200 rounded-2xl focus:border-orange-400 focus:outline-none resize-none font-medium"
          />

          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">{text.length} ký tự</span>
            <button
              onClick={handleSubmit}
              disabled={text.trim().length < 10}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all transform hover:scale-105 ${
                text.trim().length >= 10
                  ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Sparkles className="w-5 h-5" />
              Bắt Đầu Luyện Đọc!
            </button>
          </div>
        </div>
      </div>

      {/* Example Cards */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-blue-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📚 Một Số Gợi Ý</h3>
        <div className="grid gap-4">
          {[
            "Con yêu mẹ và bố rất nhiều. Mỗi ngày đi học, con đều cố gắng học giỏi.",
            "Mùa xuân đến, hoa nở khắp nơi. Chim hót líu lo trên cành cây.",
            "Bé Lan có một chú mèo nhỏ. Chú mèo lông vàng, rất đáng yêu.",
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => setText(example)}
              className="text-left p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors border-2 border-transparent hover:border-blue-300"
            >
              <p className="text-gray-700 font-medium">{example}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
