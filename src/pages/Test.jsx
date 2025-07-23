import { useState, useEffect } from "react"

// 🔊 AutoSpeaker Component
const AutoSpeaker = ({ text }) => {
  useEffect(() => {
    if (!("speechSynthesis" in window) || !text) return

    // Fix: wait for voices to load
    const speakNow = () => {
        console.log('speaking...')
      const voices = window.speechSynthesis.getVoices()
      const voice = voices.find((v) => v.lang === "en-US")

      const utterance = new SpeechSynthesisUtterance(text)
      if (voice) utterance.voice = voice
      utterance.lang = "en-US"
      utterance.rate = 1
      utterance.pitch = 1

      navigator.vibrate?.([100])
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    }

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = speakNow
    } else {
      speakNow()
    }
  }, [text])

  return null
}

// 🚀 Full Test to Test AutoSpeaker
const Test = () => {
  const [question, setQuestion] = useState("What is the capital of Kenya?")

  const sampleQuestions = [
    "What is the capital of Kenya?",
    "Who discovered gravity?",
    "What is 5 multiplied by 6?",
    "What do we call a young cat?",
    "How many continents are there on Earth?"
  ]

  const nextQuestion = () => {
    const random = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)]
    setQuestion(random)
    
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 space-y-4">
      <h1 className="text-2xl font-bold">🧠 Matilda AutoSpeaker Test</h1>
      <p className="text-lg">{question}</p>

      <button
        onClick={nextQuestion}
        className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full transition"
      >
        🔁 Next Question.
      </button>

      <AutoSpeaker text={question} />
    </div>
  )
}

export default Test
