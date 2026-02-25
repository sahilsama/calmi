
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Modality } from '@google/genai';
import { UserProfile } from '../types';
import { getSystemInstruction } from '../constants';

interface VoiceModeProps {
  profile: UserProfile;
}

// Audio Utilities
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const VoiceMode: React.FC<VoiceModeProps> = ({ profile }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState('');
  const [isCalmiSpeaking, setIsCalmiSpeaking] = useState(false);
  
  const sessionRef = useRef<any>(null);
  const audioContextsRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const streamRef = useRef<MediaStream | null>(null);

  const stopSession = async () => {
    if (sessionRef.current) {
      sessionRef.current.close?.();
      sessionRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextsRef.current) {
      await audioContextsRef.current.input.close().catch(() => {});
      await audioContextsRef.current.output.close().catch(() => {});
      audioContextsRef.current = null;
    }

    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    
    setIsActive(false);
    setIsConnecting(false);
    setIsCalmiSpeaking(false);
  };

  const startSession = async () => {
    if (isActive || isConnecting) return;
    
    setError(null);
    setIsConnecting(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // Ensure audio contexts are resumed (browsers require user gesture)
      await inputAudioContext.resume();
      await outputAudioContext.resume();
      
      audioContextsRef.current = { input: inputAudioContext, output: outputAudioContext };

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => {
                if (session) session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => (prev + ' ' + message.serverContent.outputTranscription.text).slice(-150));
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              setIsCalmiSpeaking(true);
              const ctx = outputAudioContext;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              try {
                const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0) setIsCalmiSpeaking(false);
                });
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
              } catch (decodeErr) {
                console.error("Audio decoding failed:", decodeErr);
              }
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsCalmiSpeaking(false);
            }
          },
          onerror: (e) => {
            console.error('Voice session error:', e);
            setError("The connection encountered an issue.");
            stopSession();
          },
          onclose: () => {
            setIsActive(false);
            setIsConnecting(false);
            setIsCalmiSpeaking(false);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: getSystemInstruction(profile) + "\nYou are in a live voice conversation. Keep responses natural, brief, and very conversational. Avoid long pauses.",
          outputAudioTranscription: {},
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error("Failed to start voice session:", err);
      setIsConnecting(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.includes('Permission denied')) {
        setError("Microphone access was denied. Please check your browser settings and try again.");
      } else {
        setError("Could not start voice session. Please try again.");
      }
    }
  };

  useEffect(() => {
    // We attempt an initial start, but browser policy might block it without a direct click.
    // The "Start Session" button handles the explicit gesture.
    return () => { stopSession(); };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#fdfcf9]">
      <div className="relative flex items-center justify-center w-64 h-64 mb-12">
        <AnimatePresence>
          {isCalmiSpeaking && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-stone-300 rounded-full blur-2xl"
            />
          )}
        </AnimatePresence>
        
        <motion.div
          animate={isCalmiSpeaking ? { 
            scale: [1, 1.05, 1],
            boxShadow: ["0 20px 25px -5px rgb(0 0 0 / 0.1)", "0 25px 30px -5px rgb(0 0 0 / 0.2)", "0 20px 25px -5px rgb(0 0 0 / 0.1)"]
          } : { scale: 1 }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`relative z-10 w-48 h-48 rounded-full flex items-center justify-center transition-colors duration-500 ${
            isActive ? 'bg-stone-800' : 'bg-stone-200'
          }`}
        >
          <div className={isActive ? 'text-stone-100' : 'text-stone-400'}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
        </motion.div>
      </div>

      <div className="text-center space-y-4 max-w-sm">
        <h3 className="font-serif-display text-3xl text-stone-800 h-10">
          {error ? "Voice Support Paused" : 
           isConnecting ? "Connecting to Yellow..." :
           isCalmiSpeaking ? "Yellow is speaking..." : 
           isActive ? "Yellow is listening..." : 
           "Ready to talk?"}
        </h3>
        
        <div className="h-16 flex items-center justify-center">
          {error ? (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          ) : (
            <p className="text-stone-500 italic font-light line-clamp-2">
              {transcription || (isActive ? "Just start speaking when you're ready." : "Click below to begin your voice session.")}
            </p>
          )}
        </div>
      </div>

      <div className="mt-12">
        <button
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`px-10 py-4 rounded-full font-medium transition-all shadow-lg active:scale-95 flex items-center gap-3 ${
            isActive 
              ? 'bg-white text-stone-800 border border-stone-200 hover:bg-stone-50' 
              : 'bg-stone-800 text-white hover:bg-stone-700 disabled:bg-stone-400'
          }`}
        >
          {isConnecting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Connecting...</span>
            </>
          ) : isActive ? (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>End Voice Session</span>
            </>
          ) : (
            <span>Start Yellow Voice</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default VoiceMode;
