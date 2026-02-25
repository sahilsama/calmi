import React, { useEffect, useState } from "react";
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

const API_BASE =
  (import.meta.env.VITE_API_URL as string) || "http://127.0.0.1:8000";

const MusicInterface: React.FC<MusicInterfaceProps> = ({ profile }) => {
  const [recommendations, setRecommendations] = useState<MusicRecommendation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/music/recommend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profile.name,
            supportType: profile.supportType,
            moodPreference: profile.communicationPreference,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const data = (await res.json()) as {
          items?: MusicRecommendation[];
        };

        setRecommendations(data.items ?? []);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Music recommendations error:", err);
          setError("We couldn't load music suggestions right now.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();

    return () => controller.abort();
  }, [profile]);

  return (
    <div className="min-h-screen bg-[#fdf7f0] text-stone-900 flex justify-center px-6 py-16">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-serif-display text-4xl md:text-5xl mb-2">
            Music for your mood, {profile.name}
          </h1>
          <p className="text-sm text-stone-600 max-w-xl">
            Softly tuned to how you&apos;re feeling today. These songs are chosen to
            match and gently shift your current mood.
          </p>
        </motion.div>

        {isLoading && (
          <p className="text-stone-500 text-sm">Finding songs for your mood…</p>
        )}

        {!isLoading && error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {!isLoading && !error && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white/80 border border-stone-200 p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-stone-400 mb-1">
                    {item.mood}
                  </p>
                  <h2 className="font-serif-display text-lg text-stone-900">
                    {item.title}
                  </h2>
                  <p className="text-sm text-stone-500 mb-3">{item.artist}</p>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {item.reason}
                  </p>
                </div>
              </div>
            ))}

            {recommendations.length === 0 && (
              <p className="text-sm text-stone-500 col-span-full">
                No specific recommendations yet, but we&apos;re working on it. Try
                again in a moment.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicInterface;

