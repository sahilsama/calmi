/**
 * Calmi FastAPI backend API client.
 * Uses session/create and chat/send; LLM is Ollama (e.g. medgemma).
 */

const API_BASE =
  (import.meta.env.VITE_API_URL as string) || "http://127.0.0.1:8000";

export interface SessionCreatePayload {
  name: string;
  identity: string;
  age_range: string;
  relationship_status: string;
  support_type: string;
  communication_type: string;
}

export interface SessionResponse {
  session_id: string;
}

export interface ChatResponse {
  reply: string;
}

async function post<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Create a therapy session from onboarding profile. Call once when entering chat.
 */
export async function createSession(
  payload: SessionCreatePayload
): Promise<SessionResponse> {
  return post<SessionResponse>("/session/create", payload);
}

/**
 * Send a message and get the model reply (Ollama/medgemma via backend).
 */
export async function sendMessage(
  sessionId: string,
  message: string
): Promise<ChatResponse> {
  return post<ChatResponse>("/chat/send", { session_id: sessionId, message });
}
