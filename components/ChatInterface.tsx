import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, UserProfile, CommunicationPreference } from '../types';
import { createSession, sendMessage as apiSendMessage } from '../services/calmiApi';
import VoiceMode from './VoiceMode';

function profileToSessionPayload(profile: UserProfile) {
  return {
    name: profile.name,
    identity: profile.identity,
    age_range: profile.ageRange,
    relationship_status: profile.relationshipStatus,
    support_type: profile.supportType,
    communication_type: profile.communicationPreference,
  };
}

interface ChatInterfaceProps {
  profile: UserProfile;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ profile }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mode, setMode] = useState<CommunicationPreference>(profile.communicationPreference);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode === 'text' && messages.length === 0 && !sessionId) {
      const startChat = async () => {
        setIsTyping(true);
        try {
          const { session_id } = await createSession(profileToSessionPayload(profile));
          setSessionId(session_id);
          const initialPrompt = `Hello, I'm ${profile.name}. I'm feeling ${profile.supportType} and I'm looking for a space to talk. Start our session warm and supportively.`;
          const { reply } = await apiSendMessage(session_id, initialPrompt);
          const welcomeMessage: Message = {
            id: 'welcome',
            role: 'model',
            content: reply || "I'm here with you. How are you feeling right now?",
            timestamp: new Date(),
          };
          setMessages([welcomeMessage]);
        } catch (err) {
          console.error('Failed to start chat', err);
        } finally {
          setIsTyping(false);
        }
      };
      startChat();
    }
  }, [mode, profile, messages.length, sessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, mode]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isTyping || !sessionId) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const { reply } = await apiSendMessage(sessionId, userMsg.content);
      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (error) {
      console.error('Message Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#fdfcf9] max-w-3xl mx-auto border-x border-stone-100 shadow-sm relative overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="font-serif-display text-xl text-stone-800">Calmi</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
                {mode === 'voice' ? 'Voice Session' : 'Text Session'}
              </span>
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <button
          onClick={() => setMode(mode === 'text' ? 'voice' : 'text')}
          className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors text-stone-600"
        >
          {mode === 'text' ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span className="text-xs font-medium">Switch to Voice</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs font-medium">Switch to Text</span>
            </>
          )}
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          {mode === 'text' ? (
            <motion.div
              key="text-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
              >
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] sm:max-w-[75%] px-5 py-4 rounded-2xl leading-relaxed text-lg font-light ${
                      msg.role === 'user' 
                        ? 'bg-stone-800 text-white shadow-md' 
                        : 'bg-white text-stone-800 border border-stone-100 shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-stone-100 px-5 py-4 rounded-2xl shadow-sm flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }} className="w-1.5 h-1.5 bg-stone-400 rounded-full" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Text Input Area */}
              <div className="p-6 bg-white/80 backdrop-blur-md border-t border-stone-100">
                <form onSubmit={handleSend} className="relative flex items-end gap-3">
                  <textarea
                    rows={1}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type what's on your mind..."
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-3xl px-6 py-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-200 resize-none transition-all placeholder:text-stone-400 max-h-40"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isTyping}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      !inputText.trim() || isTyping ? 'bg-stone-100 text-stone-300' : 'bg-stone-800 text-white hover:bg-stone-700 active:scale-95 shadow-lg shadow-stone-200'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="voice-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <VoiceMode profile={profile} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Shared Footer Disclaimer */}
      <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-t border-stone-50">
        <p className="text-[10px] text-stone-400 text-center uppercase tracking-widest font-medium">
          Calmi is a supportive space, not a medical service.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
