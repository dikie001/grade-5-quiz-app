import {
    ShieldCheck,
    Trash2,
    Upload
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
const MATILDA_KEY = "matilda-quiz-app";
const MESSAGE_SENT_KEY = "message-sent";

export default function AdminModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username === "admin" && pin === "1234") {
      setIsAdmin(true);
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  const clearData=()=>{
    localStorage.removeItem(MATILDA_KEY)
    localStorage.removeItem(MESSAGE_SENT_KEY)
    toast.success("Data Cleared!")

  }

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
        <div className="bg-gray-950 text-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md border border-purple-800">
          {!isAdmin ? (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-purple-400 text-center">
                Admin Login
              </h2>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full p-2 rounded-lg bg-gray-900 text-white ring-1 ring-purple-800 focus:ring-2 outline-0"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="PIN"
                  className="w-full p-2 rounded-lg bg-gray-900 text-white ring-1 ring-purple-800 focus:ring-2 outline-0"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}

              <button
                className="bg-purple-700 hover:bg-purple-600 text-white w-full py-2 rounded transition"
                onClick={handleLogin}
              >
                Login
              </button>

              <button
                className="text-xs text-gray-500 underline block mx-auto mt-2"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-purple-300">
                <ShieldCheck size={20} />
                <h2 className="text-lg font-semibold">Admin Dashboard</h2>
              </div>

              <div className="grid gap-3">
                {/* <button className="flex items-center justify-between px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-purple-900 hover:from-purple-800 transition">
                  <span className="flex items-center gap-2">
                    <Users size={18} /> Total Users
                  </span>
                  <span className="text-sm text-gray-300">42</span>
                </button> */}
{/* 
                <button className="flex items-center justify-between px-4 py-2 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 transition">
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal size={18} /> Configure Subjects
                  </span>
                </button> */}

                <button className="flex items-center justify-between px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-indigo-900 to-purple-900 hover:from-indigo-600 transition">
                  <span className="flex items-center gap-2">
                    <Upload size={18} /> Export Reports
                  </span>
                </button>
                <button onClick={clearData} className="flex items-center justify-between px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-red-800 to-red-900 hover:brightness-110 transition">
                  <span className="flex items-center gap-2">
                    <Trash2 size={18} /> Clear Quiz Data
                  </span>
                </button>
              </div>

              <button
                className="text-xs text-gray-400 underline block mx-auto mt-4"
                onClick={() => {
                  setIsAdmin(false);
                  setIsOpen(false);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );
}
