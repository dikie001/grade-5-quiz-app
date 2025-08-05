import { ArrowLeft, ChevronDown, House, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import book1 from "../assets/images/book.png";
import house from "../assets/images/3d-house.png";

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
  const [stories, setStories] = useState<StoryTypes[] | null>(null);
  const handleSelectStory = (story: StoryTypes) => setSelectedStory(story);
  const [loading, setLoading] = useState<boolean>(true);
  const handleBack = () => {
    playSend();
    setSelectedStory(null);
  };
  const { playSend } = useSound();

  useEffect(() => {
    setStories(data);
    setLoading(false);
  }),
    [];

  if (selectedStory) {
    return (
      <div className="p-6 max-w-3xl mx-auto bg-black/60 min-h-screen text-gray-900 dark:text-white">
        <button
          onClick={handleBack}
          className="mb-4 flex items-center text-blue-600 dark:text-blue-400"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back to stories
        </button>
        <h1 className="text-2xl font-bold">{selectedStory.title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          by {selectedStory.author} · {selectedStory.genre}
        </p>
        <p className="mt-4 whitespace-pre-line text-lg text-gray-200 leading-relaxed">
          {selectedStory.story}
        </p>
        <div className="mt-6 p-4 text-cyan-200  bg-gradient-to-br from-purple-950 to-black/50 rounded-2xl  shadow-lg shadow-cyan-500/30">
          <strong>Moral:</strong> {selectedStory.moral}
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex flex-col h-screen justify-center items-center ">
        <Loader2 className="animate-spin text-purple-300 " size={40} />
        <p className="text-gray-300">Loading stories...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <House
        className="text-cyan-600 "
        onClick={() => {
          playSend();
          setShowStoriesPage(false);
        }}
      />

      <h2 className="text-2xl underline  justify-center font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
        <img src={book1} className="h-10" />
        Short Stories
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 relative">
        {stories?.map((story: StoryTypes) => (
          <div
            key={story.id}
            onClick={() => {
              playSend()
              handleSelectStory(story);
            }}
            className="bg-gray-100 dark:bg-black/40 shadow-lg border border-cyan-600/40 rounded-xl p-4 cursor-pointer hover:shadow transition"
          >
            <p className=" text-end text-white  text-2xl absolute right-2  font-bold">{story.id}</p>
            <h3 className="text-lg font-semibold text-cyan-500">
              {story.title}
            </h3>
            <p className="text-sm text-gray-500">
              by {story.author} · {story.genre}
            </p>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
              {story.summary}
            </p>
            <div className="mt-3 text-blue-600 flex items-center text-sm">
              Read story <ChevronDown className="ml-1 w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
