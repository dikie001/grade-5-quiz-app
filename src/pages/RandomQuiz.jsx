import Lottie from "lottie-react";
import { Car, Circle, House, Square, Star, Trees } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import anime from "../assets/animations/anime.json";
import quizData from "../assets/jsons/RandomQuiz.json";
import car from "../assets/animations/car.json";
import useFeedbackSound from "../hooks/useFeedbackSound";

const MATILDA_KEY = "matilda-quiz-app";

const QuizPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const matilda = {
    current_score: "0",
    current_index: "0",
  };
  const { playError, playSuccess } = useFeedbackSound();

  useEffect(() => {
    getStoredData();
  }, []);

  const getStoredData = async () => {
    const storedData = localStorage.getItem(MATILDA_KEY);
    const parsedData = storedData ? JSON.parse(storedData) : [];
    setCurrentIndex(Number(parsedData.current_index || 0));
    setScore(Number(parsedData.current_score || 0));
    // matilda.current_index = parsedData.current_index || 0;
    // matilda.current_score = parsedData.current_score || 0;
    // localStorage.setItem(MATILDA_KEY, JSON.stringify(matilda));
    // console.log("Stored Data: ", parsedData);
    // console.log("Current Index: ", currentIndex);
    // console.log("Current Score: ", score);
  };

  // Early return if no quiz data provided
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
  const currentQuestion = useMemo(
    () => quizData[currentIndex],
    [quizData, currentIndex]
  );

  // Dynamic calculations
  const progress = ((currentIndex + 1) / quizData.length) * 100;
  const isLastQuestion = currentIndex === quizData.length - 1;
  const questionNumber = currentIndex + 1;
  const totalQuestions = quizData.length;

  // Handle answer selection
  const handleAnswerSelect = async (optionKey) => {
    if (showResult) return;

    setSelectedAnswer(optionKey);
    setShowResult(true);

    toast(currentQuestion.explanation);

    handleNext();

    // Update score dynamically
    if (optionKey === currentQuestion.correctAnswer) {
      playSuccess();
      setScore((prev) => prev + 1);
      matilda.current_score = score;
      localStorage.setItem(MATILDA_KEY, JSON.stringify(matilda));
    } else {
      playError();
    }
  };

  // Navigate to next question
  const handleNext = () => {
    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResult(false);
      if (currentIndex + 2 <= quizData.length) {
        setCurrentIndex((prev) => prev + 1);
        matilda.current_index = currentIndex;
        localStorage.setItem(MATILDA_KEY, JSON.stringify(matilda));
        console.log(
          "current_index",
          currentIndex,
          "quizData: ",
          quizData.length
        );
      }
    }, 4000);
  };

  // Reset quiz
  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  return (
    <div>
      <div className="absolute z-0 ">
        <Star
          className="animate-pulse absolute top-50 text-yellow-400/20 "
          size={50}
        />
        <Star
          className="animate-pulse absolute top-10 left-70 text-yellow-400/20 "
          size={50}
        />
        <Circle
          className="animate-pulse absolute top-30 left-60 text-pink-400/20 "
          size={50}
        />
        <Trees
          className="animate-pulse absolute top-90 left-2 text-green-400/20 "
          size={50}
        />
        <Car
          className="animate-pulse absolute top-130 left-40 text-green-400/40 "
          size={50}
        />
        <Square
          className=" animate-pulse absolute top-10 left-20 text-red-400/20 "
          size={50}
        />
        <House
          className="animate-pulse absolute top-80 left-50 text-blue-400/20 "
          size={50}
        />
      </div>
      <div className="min-h-screen bg-black/50 py-6 z-10">
        <div className="max-w-3xl mx-auto p-4">
          {/* Header with progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-cyan-400">
                Matilda Awino
              </h1>
            </div>

            {/* Dynamic progress bar */}
            <div>
              <div className="flex flex-row justify-between mb-1">
                {/* Score / questions answred */}
                <div className="text-gray-400 font-medium justify-self-start text-xs">
                  Score: {score} / {questionNumber}
                </div>

                {/* NUmber of quizes */}
                <div className="text-gray-400 font-medium justify-self-end  text-xs">
                  Question{" "}
                  <span className="text-cyan-400">{questionNumber} </span>
                  of <span className="text-cyan-400">{totalQuestions}</span>
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

          {/* Overral percentage score */}
          <div className="absolute top-4 right-4">
            {" "}
            <h1 className="text-4xl font-bold text-cyan-400">
              {Math.floor((score / totalQuestions) * 100)}%
            </h1>
            <hr className="text-purple-600 " />
          </div>

          {/* Question card */}
          <div className="bg-slate-900/30 rounded-xl shadow-lg shadow-black/50  p-6 mb-4">
            {/* Subject badge */}
            <div className="inline-block bg-pink-800 text-white px-3 py-1 rounded-full text-xs shadow-lg font-semibold mb-2">
              {currentQuestion?.subject}
            </div>

            {/* Question text */}
            <h2 className="text-xl font-bold text-white mb-5 leading-6">
              {currentQuestion?.question}
            </h2>

            {/* Dynamic options */}
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
                      className={`w-full text-left px-6 py-2  rounded-2xl transition-all duration-300 transform  ${
                        showResult && isCorrect
                          ? "bg-green-500/30 ring-2 ring-green-400 text-white shadow-md"
                          : isWrong
                          ? "bg-red-500/50 ring-2 ring-red-400 text-white shadow-md"
                          : showResult
                          ? "bg-gray-600 ring-gray-500 text-gray-300 opacity-60"
                          : "bg-purple-900/50 ring-1 ring-purple-700 text-gray-200 "
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
          {/* Lottie anime */}
          <Lottie
            animationData={anime}
            autoplay
            style={{ background: "transparent" }}
          />

          {currentIndex + 2 === quizData.length && (
            <div className="space-x-3">
              <div className="inline-block bg-pink-100 text-pink-800 px-4 py-2 rounded-lg font-medium">
                Final Score: {score} / {totalQuestions}
              </div>
              <button
                onClick={handleRestart}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Restart Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
