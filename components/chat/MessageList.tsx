"use client";

import { useEffect, useState, useCallback } from "react";
import { Virtuoso } from "react-virtuoso";
import { MessageItem } from "./MessageItem";
import { TypingIndicator } from "./TypingIndicator";
import { Button } from "@/components/common/Button";
import { ChevronDown } from "lucide-react";
import type { Message } from "@/types";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  streamingContent: string;
  virtuosoRef: React.RefObject<any>;
  onUserScroll: (scrolled: boolean) => void;
  showScrollButton: boolean;
  onScrollToBottom: () => void;
}

export function MessageList({
  messages,
  isLoading,
  isStreaming,
  streamingContent,
  virtuosoRef,
  onUserScroll,
  showScrollButton,
  onScrollToBottom,
}: MessageListProps) {
  const [atBottom, setAtBottom] = useState(true);

  const handleScroll = useCallback(
    (e: { atBottom: boolean }) => {
      setAtBottom(e.atBottom);
      onUserScroll(!e.atBottom);
    },
    [onUserScroll]
  );

  // Empty state
  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <WelcomeScreen />
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <Virtuoso
        ref={virtuosoRef}
        data={messages}
        atBottomStateChange={handleScroll}
        followOutput={atBottom ? "smooth" : false}
        initialTopMostItemIndex={messages.length - 1}
        itemContent={(index, message) => (
          <MessageItem
            key={message.id}
            message={message}
            isLast={index === messages.length - 1}
          />
        )}
        components={{
          Footer: () => (
            <>
              {isStreaming && streamingContent && (
                <MessageItem
                  message={{
                    id: "streaming",
                    role: "assistant",
                    content: streamingContent,
                    timestamp: new Date(),
                  }}
                  isStreaming={true}
                />
              )}
              {isLoading && !isStreaming && <TypingIndicator />}
            </>
          ),
        }}
        className="h-full"
      />

      {!atBottom && (
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full shadow-lg"
          onClick={onScrollToBottom}
        >
          <ChevronDown className="w-4 h-4 mr-1" />
          ข้อความใหม่
        </Button>
      )}
    </div>
  );
}

function WelcomeScreen() {
  const suggestions = [
    { icon: "🧠", text: "อธิบายเรื่องควอนตัมให้เข้าใจง่ายๆ", prompt: "อธิบายฟิสิกส์ควอนตัมให้คนไม่มีพื้นฐานเข้าใจ" },
    { icon: "💼", text: "ช่วยเขียนอีเมลลาออกจากงาน", prompt: "ช่วยเขียนอีเมลขอลาออกจากงานแบบสุภาพ" },
    { icon: "🌐", text: "สร้างเว็บไซต์แนะนำตัวเอง", prompt: "สร้างเว็บไซต์ Portfolio ส่วนตัวด้วย HTML CSS" },
    { icon: "🔍", text: "วิเคราะห์โค้ดนี้ว่าผิดตรงไหน", prompt: "วิเคราะห์โค้ดและบอกว่ามีบั๊กตรงไหน" },
  ];

  return (
    <div className="flex flex-col items-center max-w-2xl w-full">
      <div className="w-24 h-24 mb-6 rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-2xl">
        <span className="text-5xl">🌙</span>
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Kimi AI Clone</h1>
      <p className="text-muted-foreground text-center mb-8 max-w-md">
        ผู้ช่วย AI ที่เข้าใจบริบทยาว สร้างเว็บได้ และช่วยวิจัยลึก
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {suggestions.map((item, i) => (
          <button
            key={i}
            className="flex items-center gap-3 p-4 text-left border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
            onClick={() => {
              // Send suggestion
            }}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="text-sm">{item.text}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          200K context
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          Real-time search
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          Code execution
        </span>
      </div>
    </div>
  );
}
