import Vosk from "vosk-browser"

let modelPromise: Promise<any> | null = null

export async function loadVoskModel() {
  if (typeof window === "undefined") return null

  if (!modelPromise) {
    console.log("🔄 Loading VOSK model...")
    modelPromise = Vosk.createModel("/models/vosk-vn")
  }

  return modelPromise
}

export async function transcribeAudio(audioBuffer: AudioBuffer) {
  const model = await loadVoskModel()
  const recognizer = new model.KaldiRecognizer(audioBuffer.sampleRate)

  const channelData = audioBuffer.getChannelData(0)

  recognizer.acceptWaveform(channelData)
  const result = recognizer.finalResult()

  recognizer.free()

  return result.text || ""
}
