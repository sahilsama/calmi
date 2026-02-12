
import { GoogleGenAI, Chat } from "@google/genai";
import { UserProfile } from "../types";
import { getSystemInstruction } from "../constants";

export class GeminiChatService {
  private chat: Chat | null = null;
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  initializeChat(profile: UserProfile) {
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: getSystemInstruction(profile),
        temperature: 0.8,
        topP: 0.9,
      },
    });
  }

  async sendMessage(message: string) {
    if (!this.chat) {
      throw new Error("Chat not initialized");
    }

    try {
      const response = await this.chat.sendMessage({ message });
      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async *sendMessageStream(message: string) {
    if (!this.chat) {
      throw new Error("Chat not initialized");
    }

    try {
      const result = await this.chat.sendMessageStream({ message });
      for await (const chunk of result) {
        yield chunk.text;
      }
    } catch (error) {
      console.error("Gemini API Streaming Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiChatService();
