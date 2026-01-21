"use client";

import { useRef, useEffect } from "react";
import { Message } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-muted-foreground">
          <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Xin chào! Tôi là trợ lý AI của trang trại.</p>
          <p className="text-xs mt-2">
            Hãy hỏi tôi về đàn heo, tồn kho, hoặc quy trình chăn nuôi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          {message.role === "assistant" && (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
          )}

          <div
            className={cn(
              "max-w-[80%] rounded-2xl px-4 py-2",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
              {message.role === "assistant" &&
                isLoading &&
                message.content === "" && (
                  <span className="inline-flex gap-1">
                    <span
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </span>
                )}
            </p>
          </div>

          {message.role === "user" && (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
