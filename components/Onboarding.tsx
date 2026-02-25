import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserProfile,
  AgeRange,
  RelationshipStatus,
  SupportType,
  CommunicationPreference,
} from "../types";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: "",
    identity: "",
    ageRange: "25–34",
    relationshipStatus: "Single",
    supportType: "something else",
    communicationPreference: "text",
  });

  const steps = [
    {
      title: "Welcome to Yellow",
      description: (
        <>
          <div className="">
            <p>
              A space to breathe and be heard. <b>What should I call you?</b>
            </p>
            <br />
            <p>We created Yellow because life can be… a lot.</p>
            <br />
            <p>Sometimes you just need someone to talk to.</p>
            <br />
            <p>
              Whether you're navigating a rough day, figuring things out, or
              just need a moment to breathe.
            </p>
          </div>
        </>
      ),
      component: (
        <input
          type="text"
          className="text-black w-full bg-transparent border-b-2 border-stone-300 py-3 text-2xl outline-none focus:border-stone-500 transition-colors font-serif-display"
          placeholder="Your name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          autoFocus
        />
      ),
    },
    {
      title: "How do you identify?",
      description: "Help me understand your perspective.",
      component: (
        <input
          type="text"
          className="text-black w-full bg-transparent border-b-2 border-stone-300 py-3 text-2xl outline-none focus:border-stone-500 transition-colors font-serif-display"
          placeholder="e.g. Woman, Non-binary, Man"
          value={profile.identity}
          onChange={(e) => setProfile({ ...profile, identity: e.target.value })}
          autoFocus
        />
      ),
    },
    {
      title: "How old are you?",
      description: "This helps me frame our conversation better.",
      component: (
        <div className="grid grid-cols-2 gap-3 text-black">
          {(["under 18", "18–24", "25–34", "35+"] as AgeRange[]).map(
            (range) => (
              <button
                key={range}
                onClick={() => setProfile({ ...profile, ageRange: range })}
                className={`p-4 rounded-xl text-left border-2 transition-all ${
                  profile.ageRange === range
                    ? "border-stone-800 bg-stone-800 text-white"
                    : "border-stone-200 hover:border-stone-400"
                }`}
              >
                {range}
              </button>
            ),
          )}
        </div>
      ),
    },
    {
      title: "Relationship status?",
      description: "Our connections shape our world.",
      component: (
        <div className="grid grid-cols-2 gap-3 text-black">
          {(
            [
              "Single",
              "In a relationship",
              "Situationship",
              "Married",
              "Divorced/Separated",
              "Widowed",
            ] as RelationshipStatus[]
          ).map((status) => (
            <button
              key={status}
              onClick={() =>
                setProfile({ ...profile, relationshipStatus: status })
              }
              className={`p-3 rounded-xl text-left border-2 transition-all text-sm ${
                profile.relationshipStatus === status
                  ? "border-stone-800 bg-stone-800 text-white"
                  : "border-stone-200 hover:border-stone-400"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What brings you here today?",
      description: "Select the area where you need the most support.",
      component: (
        <div className="grid grid-cols-1 gap-3 text-black">
          {(
            [
              "anxiety",
              "depression",
              "relationships",
              "loneliness",
              "something else",
            ] as SupportType[]
          ).map((type) => (
            <button
              key={type}
              onClick={() => setProfile({ ...profile, supportType: type })}
              className={`p-4 rounded-xl text-left border-2 transition-all capitalize ${
                profile.supportType === type
                  ? "border-stone-800 bg-stone-800 text-white"
                  : "border-stone-200 hover:border-stone-400"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "How shall we talk?",
      description: "Choose your preferred way of connecting.",
      component: (
        <div className="grid grid-cols-1 gap-3 text-black">
          <button
            onClick={() =>
              setProfile({ ...profile, communicationPreference: "text" })
            }
            className={`p-6 rounded-xl text-left border-2 transition-all ${
              profile.communicationPreference === "text"
                ? "border-stone-800 bg-stone-800 text-white"
                : "border-stone-200 hover:border-stone-400"
            }`}
          >
            <div className="font-semibold mb-1 text-lg">Text Conversation</div>
            <div
              className={`text-sm ${profile.communicationPreference === "text" ? "text-stone-300" : "text-stone-500"}`}
            >
              Reflective, quiet, and written.
            </div>
          </button>
          <button
            onClick={() =>
              setProfile({ ...profile, communicationPreference: "voice" })
            }
            className={`p-6 rounded-xl text-left border-2 transition-all ${
              profile.communicationPreference === "voice"
                ? "border-stone-800 bg-stone-800 text-white"
                : "border-stone-200 hover:border-stone-400"
            }`}
          >
            <div className="font-semibold mb-1 text-lg">Voice Conversation</div>
            <div
              className={`text-sm ${profile.communicationPreference === "voice" ? "text-stone-300" : "text-stone-500"}`}
            >
              Warm, real-time, and spoken.
            </div>
          </button>

          {/* Journaling */}
          <button
            onClick={() =>
              setProfile({ ...profile, communicationPreference: "journal" })
            }
            className={`p-6 rounded-xl text-left border-2 transition-all ${
              profile.communicationPreference === "journal"
                ? "border-stone-800 bg-stone-800 text-white"
                : "border-stone-200 hover:border-stone-400"
            }`}
          >
            <div className="font-semibold mb-1 text-lg">
              Mood Journaling
            </div>

            <div
              className={`text-sm ${
                profile.communicationPreference === "journal"
                  ? "text-stone-300"
                  : "text-stone-500"
              }`}
            >
              Track moods, write freely, and visualize emotional patterns over
              time.
            </div>
          </button>

          <button
            onClick={() =>
              setProfile({ ...profile, communicationPreference: "music" })
            }
            className={`p-6 rounded-xl text-left border-2 transition-all ${
              profile.communicationPreference === "music"
                ? "border-stone-800 bg-stone-800 text-white"
                : "border-stone-200 hover:border-stone-400"
            }`}
          >
            <div className="font-semibold mb-1 text-lg">
              Music for my mood
            </div>
            <div
              className={`text-sm ${
                profile.communicationPreference === "music"
                  ? "text-stone-300"
                  : "text-stone-500"
              }`}
            >
              Emotionally aware AI-generated music recommendations.
            </div>
          </button>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(profile as UserProfile);
    }
  };

  const isNextDisabled = () => {
    if (step === 0) return !profile.name?.trim();
    if (step === 1) return !profile.identity?.trim();
    return false;
  };

  return (
    <div className="min-h-screen bg-[#fdfcf9] flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-100 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green-100 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-serif-display text-stone-900 leading-tight">
                {steps[step].title}
              </h1>
              <p className="text-stone-500 text-lg leading-relaxed">
                {steps[step].description}
              </p>
            </div>

            <div className="py-4">{steps[step].component}</div>

            <div className="flex justify-between items-center pt-8">
              <div className="flex gap-1">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i <= step ? "bg-stone-800 w-8" : "bg-stone-200 w-4"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={isNextDisabled()}
                className={`px-8 py-3 rounded-full font-medium transition-all ${
                  isNextDisabled()
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                    : "bg-stone-800 text-white hover:bg-stone-700 active:scale-95 shadow-lg shadow-stone-200"
                }`}
              >
                {step === steps.length - 1 ? "Begin" : "Continue"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
