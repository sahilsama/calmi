import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserProfile } from "../types";

interface Props {
  profile: UserProfile;
}

const JournalInterface: React.FC<Props> = ({ profile }) => {
  const [entry, setEntry] = useState("");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-stone-800 flex justify-center px-6 py-16">

      <div className="w-full max-w-3xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-serif-display text-4xl mb-2">
            Good evening, {profile.name}
          </h1>

          <p className="text-stone-500">{today}</p>
        </motion.div>

        {/* Editor */}
        <motion.textarea
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          placeholder="Write whatever is on your mind..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="w-full h-[40vh] bg-transparent resize-none outline-none text-lg leading-relaxed placeholder:text-stone-400 font-serif-display"
          autoFocus
        />

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between items-center mt-10"
        >
          <span className="text-sm text-stone-400">
            {entry.length} characters
          </span>

          <button
            className="px-6 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-700 transition"
          >
            Save entry
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default JournalInterface;