import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import QuizPage from "./pages/RandomQuiz"

const App = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e:any) => {
      e.preventDefault();
      
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(
      outcome === "accepted"
        ? "🙌 Installation accepted!"
        : "😬 Installation dismissed."
    );
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-pink-600 via-purple-800 to-purple-950 ">
      <Toaster />
      {deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className="
            fixed bottom-4 right-4 
            bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600 
            text-white font-semibold 
            px-4 py-2 
            rounded-2xl 
            shadow-lg 
            transform hover:scale-105 
            transition 
            duration-300
          "
        >
          Install Matilda 📲
        </button>
      )}
      <QuizPage/>
      
    </div>
  );
};

export default App;
