import { ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import house from "../assets/images/3d-house.png";
import book1 from "../assets/images/book.png";
import m from "../assets/images/m.png";
import data from "../assets/jsons/stories.json";
import useSound from "../hooks/useSound";

interface StoryTypes {
  id: number;
  title: string;
  author: string;
  genre: string;
  summary: string;
  story: string;
  moral: string;
}

interface PropTypes {
  setShowStoriesPage: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ShortStoriesPage({ setShowStoriesPage }: PropTypes) {
  const [selectedStory, setSelectedStory] = useState<StoryTypes | null>(null);
  const [stories, setStories] = useState<StoryTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { playSend } = useSound();

  const handleSelectStory = (story: StoryTypes) => {
    playSend();
    setSelectedStory(story);
  };

  const handleBack = () => {
    playSend();
    setSelectedStory(null);
  };

  const handleHome = () => {
    playSend();
    setShowStoriesPage(false);
  };

  useEffect(() => {
    try {
      console.log("Loading stories data:", data); // Debug log
      if (data && Array.isArray(data)) {
        setStories(data);
      } else {
        console.error("Invalid data format:", data);
        setError("Invalid stories data format");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error loading stories:", err);
      setError("Failed to load stories");
      setLoading(false);
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col justify-center items-center">
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-2xl">
          <Loader2
            className="animate-spin text-cyan-400 mx-auto mb-4"
            size={48}
          />
          <p className="text-cyan-200 text-lg font-medium">
            Loading stories...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col justify-center items-center p-4">
        <div className="bg-red-900/40 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30 shadow-2xl max-w-md">
          <p className="text-red-200 text-lg font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Story detail view
  if (selectedStory) {
    console.log("Rendering selected story:", selectedStory); // Debug log
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="max-w-3xl mx-auto p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Stories</span>
            </button>

            <img src={m} className="h-8" alt="Profile" />
          </div>

          {/* Story Content */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-3 py-8 border border-cyan-500/30 shadow-2xl">
            {/* Story Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                {selectedStory.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-cyan-300">
                <span className="bg-cyan-900/30 px-3 py-1 rounded-full text-sm">
                  by {selectedStory.author}
                </span>
                <span className="bg-purple-900/30 px-3 py-1 rounded-full text-sm">
                  {selectedStory.genre}
                </span>
              </div>
            </div>

            {/* Story Text */}
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-200 leading-relaxed whitespace-pre-line text-lg">
                {selectedStory.story}
              </p>
            </div>

            {/* Moral */}
            {selectedStory.moral && (
              <div className="p-4 bg-gradient-to-br from-purple-900/50 to-cyan-900/30 rounded-xl border border-cyan-400/30 shadow-lg">
                <h3 className="text-cyan-300 font-semibold text-lg mb-2">
                  💡 Moral of the Story
                </h3>
                <p className="text-cyan-100 leading-relaxed">
                  {selectedStory.moral}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Stories list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-3xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <img
            src={house}
            className="h-8 cursor-pointer hover:scale-110 transition-transform"
            onClick={handleHome}
            alt="Home"
          />

          <img src={book1} className="h-8" alt="Book" />
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-2">Short Stories</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Stories Grid */}
        {!stories || stories.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-cyan-200 text-lg">No stories available</p>
            <p className="text-cyan-400 text-sm mt-2">
              {loading ? "Loading stories..." : "Check your stories.json file"}
            </p>
            <div className="mt-4 text-xs text-gray-400">
              <p>
                Debug info:{" "}
                {JSON.stringify({
                  dataExists: !!data,
                  dataLength: data?.length || 0,
                  dataType: typeof data,
                  isArray: Array.isArray(data),
                })}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story: StoryTypes) => (
              <div
                key={story.id}
                onClick={() => handleSelectStory(story)}
                className="group relative bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 cursor-pointer hover:border-cyan-400/60 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Story Number Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-black/80 font-bold text-sm">
                    {story.id}
                  </span>
                </div>

                {/* Story Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                    {story.title}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-cyan-900/30 text-cyan-300 px-2 py-1 rounded-full">
                      {story.author}
                    </span>
                    <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full">
                      {story.genre}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {story.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-cyan-400 text-sm font-medium group-hover:text-cyan-300 transition-colors">
                      Read Story
                    </span>
                    <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
