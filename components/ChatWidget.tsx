"use client";

import { useState } from "react";
import { MessageCircle, X, Trash2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/use-chat";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    stopGeneration,
    clearMessages,
  } = useChat();

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-20 right-4 z-50 bg-background border rounded-lg shadow-lg transition-all duration-200",
            isMinimized
              ? "w-64 h-12"
              : "w-[380px] h-[500px] sm:w-[400px] sm:h-[550px]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">PigFarm Assistant</span>
            </div>

            <div className="flex items-center gap-1">
              {!isMinimized && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={clearMessages}
                    title="Xóa cuộc trò chuyện"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={minimizeChat}
                    title="Thu nhỏ"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={toggleChat}
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && (
            <div className="flex flex-col h-[calc(100%-56px)]">
              {/* Messages */}
              <ChatMessages messages={messages} isLoading={isLoading} />

              {/* Error display */}
              {error && (
                <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              {/* Input */}
              <ChatInput
                onSend={sendMessage}
                onStop={stopGeneration}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Minimized state - click to expand */}
          {isMinimized && (
            <button
              className="w-full h-full flex items-center justify-center"
              onClick={() => setIsMinimized(false)}
            >
              <span className="text-sm text-muted-foreground">
                Click để mở rộng
              </span>
            </button>
          )}
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 shadow-lg",
          isOpen && "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
        size="icon"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>
    </>
  );
}
