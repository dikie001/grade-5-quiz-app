import Lottie from "lottie-react";
import {
  Bell,
  Car,
  Circle,
  Home,
  Loader,
  Menu,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Square,
  Star,
  Trees,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";
import anime from "../assets/animations/anime.json";
import quizData from "../assets/jsons/RandomQuiz.json";
import useSound from "../hooks/useSound";

// TypeScript interfaces
interface QuizOption {
  [key: string]: string;
}

interface QuizQuestion {
  question: string;
  subject: string;
  options: QuizOption;
  correctAnswer: string;
  explanation: string;
}

interface StorageData {
  current_score: number;
  current_index: number;
}

interface MessageData {
  title: string;
  content: string;
}

// Constants
const MATILDA_KEY = "matilda-quiz-app";
const MESSAGE_SENT_KEY = "message-sent";
const RESULT_DISPLAY_DURATION = 4000;
const TOAST_DURATION = 8000;

const QuizPage: React.FC = () => {
  // State management
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  // Refs for consistent state tracking
  const scoreRef = useRef<number>(0);
  const currentIndexRef = useRef<number>(0);

  const { playError, playSuccess } = useSound();

  // Load stored data on component mount
  useEffect(() => {
    loadStoredData();
  }, []);

  // Load data from localStorage
  const loadStoredData = useCallback(async (): Promise<void> => {
    try {
      const storedData = localStorage.getItem(MATILDA_KEY);
      const parsedData: StorageData = storedData
        ? JSON.parse(storedData)
        : {
            current_index: 0,
            current_score: 0,
          };

      const newIndex = Number(parsedData.current_index || 0);
      const newScore = Number(parsedData.current_score || 0);

      setCurrentIndex(newIndex);
      setScore(newScore);

      // Update refs to keep them in sync
      currentIndexRef.current = newIndex;
      scoreRef.current = newScore;
    } catch (error) {
      console.error("Error loading stored data:", error);
      // Reset to defaults if data is corrupted
      resetQuizData();
    }
  }, []);

  // Save data to localStorage
  const saveDataToStorage = useCallback(
    (newScore: number, newIndex: number): void => {
      try {
        const dataToSave: StorageData = {
          current_score: newScore,
          current_index: newIndex,
        };
        localStorage.setItem(MATILDA_KEY, JSON.stringify(dataToSave));
      } catch (error) {
        console.error("Error saving data to localStorage:", error);
      }
    },
    []
  );

  // Reset quiz data
  const resetQuizData = useCallback((): void => {
    setCurrentIndex(0);
    setScore(0);
    currentIndexRef.current = 0;
    scoreRef.current = 0;
  }, []);

  // Early return if no quiz data
  if (!quizData || !Array.isArray(quizData) || quizData.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-pink-100 border border-pink-300 text-pink-800 px-4 py-3 rounded-lg">
          No quiz data available. Please provide quiz data.
        </div>
      </div>
    );
  }

  // Memoized current question
  const currentQuestion: QuizQuestion = useMemo(
    () => quizData[currentIndex] as QuizQuestion,
    [currentIndex]
  );

  // Memoized calculations
  const progress = useMemo(
    () => ((currentIndex + 1) / quizData.length) * 100,
    [currentIndex, quizData.length]
  );

  const isLastQuestion = useMemo(
    () => currentIndex === quizData.length - 1,
    [currentIndex, quizData.length]
  );

  const questionNumber = useMemo(() => currentIndex + 1, [currentIndex]);

  const totalQuestions = useMemo(() => quizData.length, []);

  const overallPercentage = useMemo(
    () => Math.floor((score / totalQuestions) * 100),
    [score, totalQuestions]
  );

  // Custom toast component
  const showCustomToast = useCallback(
    (message: string, duration: number = TOAST_DURATION): void => {
      toast.custom(
        (t) => (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transition-all ${
              t.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            } bg-purple-800/90 ring-1 ring-purple-500 text-white font-medium relative overflow-hidden`}
          >
            <Bell
              className="text-yellow-400 absolute top-10 left-15 opacity-30"
              size={30}
            />
            <Bell
              className="text-purple-600 absolute top-2 left-2 opacity-40"
              size={30}
            />
            <Bell
              className="text-red-400 absolute top-5 left-50 opacity-40"
              size={30}
            />
            <span className="relative z-10">{message}</span>
          </div>
        ),
        { duration }
      );
    },
    []
  );

  // Handle answer selection
  const handleAnswerSelect = useCallback(
    async (optionKey: string): Promise<void> => {
      if (showResult) return;

      setSelectedAnswer(optionKey);
      setShowResult(true);

      // Show explanation toast
      showCustomToast(currentQuestion.explanation);

      // Check if answer is correct
      const isCorrect = optionKey === currentQuestion.correctAnswer;

      if (isCorrect) {
        playSuccess();
        const newScore = scoreRef.current + 1;
        setScore(newScore);
        scoreRef.current = newScore;
      } else {
        playError();
      }

      // Handle next question progression
      handleNextQuestion();
    },
    [showResult, currentQuestion, playSuccess, playError, showCustomToast]
  );

  // Handle progression to next question
  const handleNextQuestion = useCallback((): void => {
    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResult(false);

      if (!isLastQuestion) {
        const newIndex = currentIndexRef.current + 1;
        setCurrentIndex(newIndex);
        currentIndexRef.current = newIndex;

        // Save progress
        saveDataToStorage(scoreRef.current, newIndex);

        console.log("Moving to question:", newIndex + 1, "of", quizData.length);
      }
    }, RESULT_DISPLAY_DURATION);
  }, [isLastQuestion, saveDataToStorage]);

  // Reset quiz
  const handleRestart = useCallback((): void => {
    resetQuizData();
    setSelectedAnswer(null);
    setShowResult(false);

    // Clear localStorage
    localStorage.removeItem(MATILDA_KEY);
    localStorage.removeItem(MESSAGE_SENT_KEY);

    setConfirmModal(false);
  }, [resetQuizData]);

  // Message data for contacting developer
  const messageToDikie: MessageData = useMemo(
    () => ({
      title: "I need more questions",
      content:
        "Hello, this is Matilda. I hope you are doing great my bro. I am requesting you to add more questions to my app. Thanks",
    }),
    []
  );

  // Send message to developer
  const sendMessage = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      const messageSentStatus = localStorage.getItem(MESSAGE_SENT_KEY);

      if (messageSentStatus === "true") {
        playError();
        toast.error(
          "You have already sent a message. Kindly wait as I process your request",
          { id: "toasty", duration: 5000 }
        );
        return;
      }

      await sendEmailToDeveloper();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  }, [playError, messageToDikie]);

  // Send email function
  const sendEmailToDeveloper = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch("https://formspree.io/f/mgvvgozj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(messageToDikie),
      });

      if (response.ok) {
        // Show success message
        toast.custom(
          (t) => (
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transition-all ${
                t.visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              } bg-purple-900/90 ring-1 ring-purple-500 text-white font-medium`}
            >
              <span>
                Hello Matilda, I have received your message. I will add more
                quizzes to your app as soon as possible. Bye
              </span>
            </div>
          ),
          { duration: 10000 }
        );

        localStorage.setItem(MESSAGE_SENT_KEY, "true");
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      if (error instanceof TypeError) {
        playError();
        toast.error("Buy bundles and connect to the internet to send message", {
          id: "toasty",
          duration: 5000,
        });
      } else {
        playError();
        toast.error("Failed to send message. Please try again later.", {
          id: "toasty",
          duration: 5000,
        });
      }
      console.error("Network error:", error);
    }
  }, [messageToDikie, playError]);

  // Handle menu click
  const handleMenuClick = useCallback((): void => {
    setOpenMenu(!openMenu);
    toast.error("Menu not implemented yet", { id: "toasty" });
    playError();
  }, [openMenu, playError]);

  return (
    <div>
      {/* Background decorative elements */}
      <div className="absolute z-0">
        <Star
          className="animate-pulse absolute top-50 text-yellow-400/20"
          size={50}
        />
        <Star
          className="animate-pulse absolute top-10 left-70 text-yellow-400/20"
          size={50}
        />
        <Circle
          className="animate-pulse absolute top-30 left-60 text-pink-400/20"
          size={50}
        />
        <Trees
          className="animate-pulse absolute top-90 left-2 text-green-400/20"
          size={50}
        />
        <Car
          className="animate-pulse absolute top-130 left-40 text-green-400/40"
          size={50}
        />
        <Square
          className="animate-pulse absolute top-10 left-20 text-red-400/20"
          size={50}
        />
        <Home
          className="animate-pulse absolute top-80 left-50 text-blue-400/20"
          size={50}
        />
      </div>

      <div className="min-h-screen bg-black/50 py-6 z-10">
        {/* Menu button */}
        <div className="absolute top-2 left-3">
          <Menu
            onClick={handleMenuClick}
            className="text-pink-400 cursor-pointer hover:text-pink-300 transition-colors"
            size={24}
          />
        </div>

        <div className="max-w-3xl mx-auto p-4">
          {/* Header with progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-cyan-400">
                Matilda Awino
              </h1>
            </div>

            {/* Progress section */}
            <div>
              <div className="flex flex-row justify-between mb-1">
                {/* Score display */}
                <div className="text-gray-400 font-medium justify-self-start text-xs">
                  Score: {score} / {questionNumber}
                </div>

                {/* Question counter */}
                <div className="text-gray-400 font-medium justify-self-end text-xs">
                  Question{" "}
                  <span className="text-cyan-400">{questionNumber}</span> of{" "}
                  <span className="text-cyan-400">{totalQuestions}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-500 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-700 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Overall percentage score */}
          <div className="absolute top-4 right-4">
            <h1 className="text-4xl font-bold text-cyan-400">
              {overallPercentage}%
            </h1>
            <hr className="text-purple-600" />
          </div>

          {/* Question card */}
          <div className="bg-slate-900/30 rounded-xl shadow-lg shadow-black/50 p-6 mb-4">
            {/* Subject badge */}
            <div className="inline-block bg-pink-800 text-white px-3 py-1 rounded-full text-xs shadow-lg font-semibold mb-2">
              {currentQuestion?.subject}
            </div>

            {/* Question text */}
            <h2 className="text-xl font-bold text-white mb-5 leading-6">
              {currentQuestion?.question}
            </h2>

            {/* Answer options */}
            <div className="space-y-3">
              {currentQuestion?.options &&
                Object.entries(currentQuestion.options).map(([key, value]) => {
                  const isCorrect = key === currentQuestion.correctAnswer;
                  const isSelected = key === selectedAnswer;
                  const isWrong = showResult && isSelected && !isCorrect;

                  return (
                    <button
                      key={key}
                      onClick={() => handleAnswerSelect(key)}
                      disabled={showResult}
                      className={`w-full text-left px-6 py-2 rounded-2xl transition-all duration-300 transform ${
                        showResult && isCorrect
                          ? "bg-green-500/30 ring-2 ring-green-400 text-white shadow-md"
                          : isWrong
                          ? "bg-red-500/50 ring-2 ring-red-400 text-white shadow-md"
                          : showResult
                          ? "bg-gray-600 ring-gray-500 text-gray-300 opacity-60"
                          : "bg-purple-900/50 ring-1 ring-purple-700 text-gray-200 hover:bg-purple-800/50"
                      } ${!showResult ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <div className="flex items-center">
                        <span className="bg-pink-500 text-pink-900 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                          {key}
                        </span>
                        <span className="font-medium">{value}</span>
                        {showResult && isCorrect && (
                          <span className="ml-auto text-green-950 text-xl">
                            ✓
                          </span>
                        )}
                        {isWrong && (
                          <span className="ml-auto text-red-950 text-lg">
                            ✗
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Lottie animation */}
          <Lottie
            animationData={anime}
            autoplay
            style={{ background: "transparent" }}
          />
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmModal && (
        <div className="fixed z-50 inset-0 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gradient-to-bl from-purple-800/80 to-slate-950 rounded-3xl shadow-2xl p-4 py-8 max-w-md w-full mx-4 transform">
            <h1 className="text-2xl text-center text-white font-bold">
              Are you sure?
            </h1>
            <hr className="text-gray-600 mb-3" />
            <p className="text-gray-200">
              This will reset all progress you have made so far!
            </p>
            <div className="flex justify-between mt-3">
              <button
                onClick={() => setConfirmModal(false)}
                className="bg-gray-700 text-white px-6 focus:ring-1 ring-purple-600 py-2 rounded-xl font-bold shadow-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRestart}
                className="bg-green-800 text-white px-6 focus:ring-1 ring-purple-600 py-2 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz completion modal */}
      {isLastQuestion && showResult && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-bl from-purple-800/80 to-slate-950 rounded-3xl shadow-2xl p-4 py-8 max-w-md w-full mx-4 transform">
            {/* Header with stars */}
            <div className="text-center mb-6">
              <div className="flex justify-center space-x-2 mb-4">
                <Star className="w-8 h-8 text-yellow-400 fill-current" />
                <Sparkles className="w-8 h-8 text-purple-400" />
                <Star className="w-8 h-8 text-yellow-400 fill-current" />
              </div>
              <h1 className="text-2xl font-bold text-white">Quiz Complete!</h1>
              <h1 className="text-xs font-bold text-gray-300 mb-2">
                Well done Matilda
              </h1>
            </div>

            {/* Score Display */}
            <div className="shadow-xl bg-gradient-to-tr from-black/60 to-indigo-800 rounded-2xl p-4 mb-4 text-center">
              <p className="text-gray-300 text-lg mb-1">Your Score:</p>
              <div className="text-3xl font-bold text-green-500 mb-2">
                {score}/{totalQuestions}
              </div>
              <div className="text-2xl font-semibold text-green-500">
                {((score / totalQuestions) * 100).toFixed(1)}%
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-4">
              <button
                onClick={() => setConfirmModal(true)}
                className="w-full bg-gradient-to-bl from-blue-950 to-indigo-800 text-white px-6 py-4 rounded-2xl font-bold text-lg transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-3"
              >
                <RotateCcw className="text-white/80" size={20} />
                <span>Try Again!</span>
              </button>

              <div>
                <p className="text-gray-200 mb-1 font-medium">
                  Do you want more Quizzes?
                </p>
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="w-full bg-gradient-to-tr from-black/60 to-indigo-800 text-white px-6 py-4 rounded-2xl font-bold text-lg transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div>
                    {loading ? (
                      <div className="flex flex-row items-center justify-center gap-2">
                        <Loader
                          className="text-yellow-500 animate-spin"
                          size={20}
                        />
                        <p>Sending message...</p>
                      </div>
                    ) : (
                      <div className="flex flex-row items-center justify-center gap-2">
                        <MessageCircle className="text-white/80" size={20} />
                        Tell dikie
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
