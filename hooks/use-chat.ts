"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UseChatOptions {
  apiUrl?: string;
}

export function useChat(options: UseChatOptions = {}) {
  const {
    apiUrl = process.env.NEXT_PUBLIC_CHATBOT_API_URL || "http://localhost:8000",
  } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize session ID
  useEffect(() => {
    const stored = sessionStorage.getItem("chat_session_id");
    if (stored) {
      setSessionId(stored);
    } else {
      const newId = uuidv4();
      sessionStorage.setItem("chat_session_id", newId);
      setSessionId(newId);
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setError(null);

      // Add user message
      const userMessage: Message = {
        id: uuidv4(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Prepare assistant message placeholder
      const assistantMessageId = uuidv4();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Create abort controller
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(`${apiUrl}/chat/message/stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content.trim(),
            session_id: sessionId,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response body");
        }

        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Parse SSE events
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data:")) {
              try {
                const data = JSON.parse(line.slice(5).trim());

                if (data.content) {
                  // Update assistant message with new content
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: msg.content + data.content }
                        : msg
                    )
                  );
                }

                if (data.session_id) {
                  setSessionId(data.session_id);
                  sessionStorage.setItem("chat_session_id", data.session_id);
                }
              } catch {
                // Ignore parse errors for non-JSON data lines
              }
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          // Request was cancelled
          return;
        }

        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);

        // Update assistant message with error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: `Xin lỗi, đã có lỗi xảy ra: ${errorMessage}`,
                }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [apiUrl, isLoading, sessionId]
  );

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);

    // Clear session
    const newId = uuidv4();
    sessionStorage.setItem("chat_session_id", newId);
    setSessionId(newId);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sessionId,
    sendMessage,
    stopGeneration,
    clearMessages,
  };
}
