import {  useState } from "react";
import { RefreshCcw, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type UpdateStatus = "idle" | "checking" | "success" | "error";

interface StatusConfig {
  icon: React.ReactNode;
  message: string;
  className: string;
}

export default function CheckUpdatesModal() {
  const [status, setStatus] = useState<UpdateStatus>("idle");
  const [isChecking, setIsChecking] = useState(false);

  const statusConfig: Record<UpdateStatus, StatusConfig> = {
    idle: {
      icon: null,
      message: "",
      className: "",
    },
    checking: {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      message: "Checking for updates...",
      className: "text-blue-400",
    },
    success: {
      icon: <CheckCircle className="w-4 h-4" />,
      message: "Update checked successfully! Reloading...",
      className: "text-green-400",
    },
    error: {
      icon: <AlertCircle className="w-4 h-4" />,
      message: "Unable to check for updates",
      className: "text-red-400",
    },
  };

  const checkUpdate = async (): Promise<void> => {
    if (isChecking) return;

    setIsChecking(true);
    setStatus("checking");

    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();

        if (registration) {
          await registration.update();
          setStatus("success");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setStatus("error");
          setIsChecking(false);
        }
      } else {
        setStatus("error");
        setIsChecking(false);
      }
    } catch (error) {
      console.error("Update check failed:", error);
      setStatus("error");
      setIsChecking(false);
    }
  };



  const handleClose = (): void => {
    if (isChecking) return;
    setStatus("idle");

  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  return (
    <>
      {/* <button
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
      >
        <RefreshCcw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
        Check Updates
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button> */}

        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8 max-w-md w-full space-y-6 shadow-2xl border border-gray-700/50 backdrop-blur-sm animate-in zoom-in-95 duration-300"
            onClick={handleModalClick}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <RefreshCcw className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Check Updates
                </h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isChecking}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Keep your Matilda Quiz App up to date with the latest features
                and improvements.
              </p>

              {/* Action Button */}
              <button
                onClick={checkUpdate}
                disabled={isChecking}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-3 group"
              >
                {!isChecking ? (
                  <>
                    <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    Check for Updates
                  </>
                ) : (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checking...
                  </>
                )}
              </button>

              {/* Status Display */}
              {status !== "idle" && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 animate-in slide-in-from-bottom-2 duration-300 ${statusConfig[status].className}`}
                >
                  {statusConfig[status].icon}
                  <span className="font-medium">
                    {statusConfig[status].message}
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-700/50">
              <p className="text-xs text-gray-500 text-center">
                This will check for the latest version and reload the app if
                updates are found.
              </p>
            </div>
          </div>
        </div>
    </>
  );
}
