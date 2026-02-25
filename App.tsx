import React, { useState } from "react";
import { UserProfile } from "./types";

import Header from "./components/Layouts/Headers";
import Landing from "./components/pages/Landing";
import Onboarding from "./components/Onboarding";
import ChatInterface from "./components/ChatInterface";

type View = "landing" | "onboarding" | "chat";

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [view, setView] = useState<View>("landing");

  const handleOnboardingComplete = (userData: UserProfile) => {
    setProfile(userData);
    setView("chat");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onStart={() => setView("onboarding")} onLogoClick={() => setView("landing")} />

      {view === "landing" && <Landing onStart={() => setView("onboarding")} />}

      {view === "onboarding" && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      {view === "chat" && profile && <ChatInterface profile={profile} />}
    </div>
  );
};

export default App;