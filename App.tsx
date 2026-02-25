import React, { useState } from "react";
import { UserProfile } from "./types";

import Header from "./components/Layouts/Headers";
import Landing from "./components/pages/Landing";
import Onboarding from "./components/Onboarding";
import ChatInterface from "./components/ChatInterface";
import VoiceMode from "./components/VoiceMode";
import JournalInterface from "./components/JournalInterface";

type View = "landing" | "onboarding" | "chat";

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [view, setView] = useState<View>("landing");

  const handleOnboardingComplete = (userData: UserProfile) => {
    setProfile(userData);
    setView("chat");
  };

  const renderMainApp = () => {
    if (!profile) return null;

    switch (profile.communicationPreference) {
      case "voice":
        return <VoiceMode profile={profile} />;

      case "journal":
        return <JournalInterface profile={profile} />;

      case "text":
      default:
        return <ChatInterface profile={profile} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">

      <Header
        onStart={() => setView("onboarding")}
        onLogoClick={() => setView("landing")}
      />

      {view === "landing" && (
        <Landing onStart={() => setView("onboarding")} />
      )}

      {view === "onboarding" && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      {view === "chat" && renderMainApp()}

    </div>
  );
};

export default App;