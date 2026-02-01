import type { AnalysisResult } from "@/components/reading-practice"

const encouragingFeedbacks = {
  excellent: [
    "Wowww! Con đọc hay quá đi mất! Cô giáo nghe mà thích lắm luôn!",
    "Xuất sắc! Con là ngôi sao đọc sáng nhất hôm nay đó nha!",
    "Trời ơi, giọng con nghe hay như ca sĩ vậy! Tuyệt vời lắm!",
    "Con giỏi quá xá luôn! Cô muốn nghe con đọc hoài à!",
    "Đỉnh của chóp! Con đọc chuẩn như máy phát thanh vậy đó!",
    "Siêu phẩm! Con xứng đáng được tặng một triệu ngôi sao!",
    "Ôi chao! Giọng đọc của con làm cô muốn nhảy lên vì vui!",
    "Tuyệt cú mèo! Con đọc hay đến nỗi cô muốn vỗ tay không ngừng!",
    "Con như một ngôi sao nhỏ tỏa sáng vậy đó! Hay quá trời!",
  ],
  good: [
    "Giỏi lắm con! Còn một chút xíu nữa là hoàn hảo rồi!",
    "Oa, con đọc hay rồi đó! Cố thêm chút nữa nhé siêu nhân!",
    "Con làm tốt lắm! Cô thấy con tiến bộ nhiều rồi đó!",
    "Hay quá! Con như một chú ong chăm chỉ luyện đọc vậy!",
    "Tuyệt vời! Con đang trên đường trở thành ngôi sao đọc đó!",
    "Con cố gắng tốt lắm! Cô rất tự hào về con!",
    "Gần hoàn hảo rồi! Con như viên kim cương sắp tỏa sáng!",
    "Cô thấy con rất cố gắng! Tiến bộ từng ngày nhé con!",
  ],
  average: [
    "Không sao đâu con! Chưa giỏi thì mình tập thêm nha!",
    "Con đang tiến bộ rồi đó! Cứ từ từ, chậm mà chắc nha!",
    "Ráng lên con! Cô biết con có thể làm tốt hơn mà!",
    "Tốt rồi! Mỗi ngày một chút, con sẽ giỏi thôi!",
    "Cố lên nào! Con giống như siêu anh hùng đang tập bay vậy!",
    "Cô tin con! Lần sau con sẽ đọc hay hơn nhiều!",
    "Không sao! Ai cũng phải luyện tập mới giỏi được!",
  ],
  needsWork: [
    "Ôi, con ơi! Mình đọc lại một lần nữa nha! Từ từ thôi!",
    "Không sao! Ai cũng phải tập mà! Con làm được mà!",
    "Cô tin con! Đọc chậm lại và rõ ràng hơn nha con!",
    "Ráng lên! Mỗi lần tập là một lần giỏi hơn đó con!",
    "Con như hạt giống đang nảy mầm! Tưới nước mỗi ngày là sẽ lớn!",
    "Đừng nản nhé con! Cô sẽ ở đây cổ vũ con!",
    "Chậm mà chắc nha con! Đọc từ từ, rõ ràng là được!",
  ],
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"'""''…–—]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length
  const n = str2.length
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]) + 1
      }
    }
  }
  return dp[m][n]
}

function calculateSimilarity(original: string, recorded: string): number {
  const normalizedOriginal = normalizeText(original)
  const normalizedRecorded = normalizeText(recorded)

  if (normalizedOriginal === normalizedRecorded) return 100
  if (!normalizedRecorded) return 0

  // So sánh theo từ thay vì ký tự
  const originalWords = normalizedOriginal.split(" ")
  const recordedWords = normalizedRecorded.split(" ")

  let matchedWords = 0
  const usedIndices = new Set<number>()

  for (const origWord of originalWords) {
    let bestMatchIndex = -1
    let bestMatchScore = 0

    for (let i = 0; i < recordedWords.length; i++) {
      if (usedIndices.has(i)) continue

      const recWord = recordedWords[i]
      // Tính độ tương đồng của từ
      if (origWord === recWord) {
        bestMatchIndex = i
        bestMatchScore = 1
        break
      }

      const distance = levenshteinDistance(origWord, recWord)
      const similarity = 1 - distance / Math.max(origWord.length, recWord.length)

      if (similarity > bestMatchScore && similarity >= 0.6) {
        bestMatchScore = similarity
        bestMatchIndex = i
      }
    }

    if (bestMatchIndex !== -1) {
      usedIndices.add(bestMatchIndex)
      matchedWords += bestMatchScore
    }
  }

  const wordScore = (matchedWords / originalWords.length) * 100

  // Kết hợp với so sánh ký tự để có kết quả chính xác hơn
  const distance = levenshteinDistance(normalizedOriginal, normalizedRecorded)
  const maxLength = Math.max(normalizedOriginal.length, normalizedRecorded.length)
  const charScore = Math.max(0, ((maxLength - distance) / maxLength) * 100)

  // Trọng số: 60% từ, 40% ký tự
  const finalScore = wordScore * 0.6 + charScore * 0.4

  return Math.round(Math.min(100, finalScore))
}

function findMistakes(original: string, recorded: string): { word: string; suggestion: string }[] {
  const originalWords = normalizeText(original).split(" ")
  const recordedWords = normalizeText(recorded).split(" ")
  const mistakes: { word: string; suggestion: string }[] = []

  const originalSet = new Set(originalWords)

  for (const word of recordedWords) {
    if (word.length > 1 && !originalSet.has(word)) {
      let bestMatch = ""
      let bestScore = 0

      for (const origWord of originalWords) {
        const distance = levenshteinDistance(word, origWord)
        const score = 1 - distance / Math.max(word.length, origWord.length)
        if (score > bestScore && score > 0.4) {
          bestScore = score
          bestMatch = origWord
        }
      }

      if (bestMatch && bestMatch !== word) {
        // Tránh duplicate
        if (!mistakes.some((m) => m.word === word)) {
          mistakes.push({ word, suggestion: bestMatch })
        }
      }
    }
  }

  return mistakes.slice(0, 5)
}

function findPausePoints(text: string): string[] {
  const pausePoints: string[] = []
  const sentences = text.split(/[.!?]/).filter((s) => s.trim())

  for (const sentence of sentences) {
    const parts = sentence.split(",")
    if (parts.length > 1) {
      for (let i = 0; i < parts.length - 1; i++) {
        const lastWords = parts[i].trim().split(" ").slice(-2).join(" ")
        if (lastWords && !pausePoints.includes(lastWords)) {
          pausePoints.push(lastWords)
        }
      }
    }
  }

  // Thêm điểm ngắt tự nhiên sau dấu chấm
  const sentenceEndings = text.match(/[^.!?]+[.!?]/g) || []
  for (const ending of sentenceEndings.slice(0, 2)) {
    const words = ending.trim().split(" ")
    if (words.length >= 2) {
      const lastTwo = words.slice(-2).join(" ").replace(/[.!?]/g, "")
      if (!pausePoints.includes(lastTwo)) {
        pausePoints.push(lastTwo)
      }
    }
  }

  return pausePoints.slice(0, 4)
}

function findEmphasisWords(text: string): string[] {
  const emphasisWords: string[] = []

  // Tìm các từ/cụm từ cần nhấn mạnh
  const patterns = [
    /rất\s+\w+/gi,
    /quá\s+\w+/gi,
    /thật\s+\w+/gi,
    /nhiều\s+\w*/gi,
    /đẹp/gi,
    /hay/gi,
    /yêu/gi,
    /vui/gi,
    /buồn/gi,
    /tuyệt vời/gi,
    /xuất sắc/gi,
  ]

  for (const pattern of patterns) {
    const matches = text.match(pattern)
    if (matches) {
      for (const match of matches) {
        if (!emphasisWords.includes(match.trim())) {
          emphasisWords.push(match.trim())
        }
      }
    }
  }

  // Tìm từ cuối câu cảm thán
  const exclamations = text.match(/[^.!?]*!/g) || []
  for (const exc of exclamations) {
    const words = exc.trim().split(" ")
    if (words.length > 0) {
      const lastWord = words[words.length - 1].replace("!", "")
      if (lastWord && !emphasisWords.includes(lastWord)) {
        emphasisWords.push(lastWord)
      }
    }
  }

  return [...new Set(emphasisWords)].slice(0, 5)
}

function getFeedback(score: number): string {
  let feedbackArray: string[]

  if (score >= 90) {
    feedbackArray = encouragingFeedbacks.excellent
  } else if (score >= 70) {
    feedbackArray = encouragingFeedbacks.good
  } else if (score >= 50) {
    feedbackArray = encouragingFeedbacks.average
  } else {
    feedbackArray = encouragingFeedbacks.needsWork
  }

  return feedbackArray[Math.floor(Math.random() * feedbackArray.length)]
}

export async function analyzeReading(originalText: string, recordedText: string): Promise<AnalysisResult> {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const score = calculateSimilarity(originalText, recordedText)
  const mistakes = findMistakes(originalText, recordedText)
  const pausePoints = findPausePoints(originalText)
  const emphasisWords = findEmphasisWords(originalText)
  const feedback = getFeedback(score)
  const isPerfect = score >= 90

  console.log("[v0] Analysis complete - Score:", score)

  return {
    score,
    feedback,
    mistakes,
    pausePoints,
    emphasisWords,
    isPerfect,
  }
}
