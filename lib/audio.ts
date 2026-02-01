// lib/audio.ts
import { loadVoskModel } from "./vosk-client"
import { Client } from "@gradio/client"

export async function recordAudio() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" })

  const chunks: BlobPart[] = []
  recorder.ondataavailable = e => e.data.size && chunks.push(e.data)

  recorder.start()

  return {
    stop: () =>
      new Promise<Blob>(resolve => {
        recorder.onstop = () => {
          stream.getTracks().forEach(t => t.stop())
          resolve(new Blob(chunks, { type: "audio/webm" }))
        }
        recorder.stop()
      }),
  }
}

export async function speechToText(blob: Blob) {
  const audioCtx = new AudioContext()
  const buffer = await blob.arrayBuffer()
  const audioBuffer = await audioCtx.decodeAudioData(buffer)

  const model = await loadVoskModel()
  const recognizer = new model.KaldiRecognizer(audioBuffer.sampleRate)

  recognizer.acceptWaveform(audioBuffer.getChannelData(0))
  const result = recognizer.finalResult()

  recognizer.free()
  return result.text || ""
}

export async function transcribeFromBlob(audioBlob: Blob): Promise<string> {
  // 1️⃣ Blob → ArrayBuffer
  const arrayBuffer = await audioBlob.arrayBuffer()

  // 2️⃣ Decode audio
  const audioCtx = new AudioContext()
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)

  // 3️⃣ Load VOSK
  const model = await loadVoskModel()
  const recognizer = new model.KaldiRecognizer(audioBuffer.sampleRate)

  // 4️⃣ Đưa PCM vào VOSK
  recognizer.acceptWaveform(audioBuffer.getChannelData(0))

  const result = recognizer.finalResult()
  recognizer.free()

  return result?.text || ""
}


export async function sendToWhisper(audioBlob: Blob) {
  const form = new FormData()
  form.append("file", audioBlob)

  const res = await fetch("https://huggingface.co/spaces/EmilyXiu/Audio", {
    method: "POST",
    body: form
  })

  const text = await res.text()
  return text
}


interface GradioResult {
  data: unknown[]
}

export async function sendToWhisperHost(audioBlob: Blob): Promise<string> {
  const client = await Client.connect("EmilyXiu/Audio")

  const file = new File([audioBlob], "record.webm", {
    type: "audio/webm",
  })

  const result = (await client.predict("/transcribe", [
    file,
  ])) as GradioResult

  if (!Array.isArray(result.data) || typeof result.data[0] !== "string") {
    throw new Error("Whisper trả về dữ liệu không hợp lệ")
  }

  return result.data[0]
}