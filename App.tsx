
import React, { useState } from 'react';
import { UserProfile } from './types';
import Onboarding from './components/Onboarding';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const handleOnboardingComplete = (userData: UserProfile) => {
    setProfile(userData);
  };

  return (
    <div className="min-h-screen">
      {!profile ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <ChatInterface profile={profile} />
      )}
    </div>
  );
};

export default App;
