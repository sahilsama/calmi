import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { UserProfile } from "../types";

interface MusicInterfaceProps {
  profile: UserProfile;
}

type MusicRecommendation = {
  id: string;
  title: string;
  artist: string;
  reason: string;
  mood: string;
};

const moodColors: Record<string, string> = {
  calm: "bg-blue-100 text-blue-700",
  hopeful: "bg-green-100 text-green-700",
  peaceful: "bg-purple-100 text-purple-700",
  uplifting: "bg-amber-100 text-amber-700",
};

const API_BASE =
  (import.meta.env.VITE_API_URL as string) || "http://127.0.0.1:8000";

const MusicInterface: React.FC<MusicInterfaceProps> = ({ profile }) => {
  const [recommendations, setRecommendations] = useState<MusicRecommendation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/music/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();
      setRecommendations(data.items ?? []);
    } catch (err: any) {
      console.error("Music recommendations error:", err);
      setError("We couldn't load music suggestions right now.");
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <div className="min-h-screen bg-[#fdf7f0] text-stone-900 flex justify-center px-6 py-16">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex items-center justify-between gap-4 flex-wrap"
        >
          <div>
            <h1 className="font-serif-display text-4xl md:text-5xl mb-2">
              Music for your mood, {profile.name}
            </h1>
            <p className="text-sm text-stone-600 max-w-xl">
              Softly tuned to how you&apos;re feeling today. These songs are
              chosen to match and gently shift your current mood.
            </p>
          </div>

          {/* Regenerate button */}
          <button
            onClick={fetchRecommendations}
            className="text-sm underline text-stone-600 hover:text-stone-900 transition"
          >
            Regenerate
          </button>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <p className="text-stone-500 text-sm">
            Finding songs for your mood…
          </p>
        )}

        {/* Error */}
        {!isLoading && error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {/* Grid */}
        {!isLoading && !error && recommendations.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white/80 border border-stone-200 p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Mood badge */}
                  <span
                    className={`text-xs px-2 py-1 rounded-full inline-block mb-2 ${
                      moodColors[item.mood] ||
                      "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {item.mood}
                  </span>

                  <h2 className="font-serif-display text-lg text-stone-900">
                    {item.title}
                  </h2>

                  <p className="text-sm text-stone-500 mb-3">
                    {item.artist}
                  </p>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    {item.reason}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && recommendations.length === 0 && (
          <p className="text-sm text-stone-500 mt-6">
            No recommendations received yet. Try regenerating.
          </p>
        )}
      </div>
    </div>
  );
};

export default MusicInterface;