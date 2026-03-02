"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { InputArea } from "./InputArea";
import { ToolBar } from "./ToolBar";
import { ContextWindowIndicator } from "./ContextWindowIndicator";
import { useChatStore } from "@/store";
import { generateId } from "@/lib/utils";
import type { Message } from "@/types";
import { toast } from "sonner";

export function ChatContainer() {
  const {
    messages,
    isLoading,
    isStreaming,
    streamingContent,
    activeTool,
    showThinking,
    addMessage,
    updateMessage,
    setIsLoading,
    setIsStreaming,
    setStreamingContent,
    appendStreamingContent,
    setActiveTool,
    setShowThinking,
  } = useChatStore();

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [userScrolled, setUserScrolled] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Auto-scroll to bottom when new messages arrive (unless user scrolled up)
  useEffect(() => {
    if (!userScrolled && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: messages.length - 1,
        behavior: "smooth",
        align: "end",
      });
    }
  }, [messages, streamingContent, userScrolled]);

  const handleSendMessage = useCallback(
    async (content: string, attachments?: File[]) => {
      if (!content.trim() && (!attachments || attachments.length === 0)) return;

      // Create user message
      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
        attachments: attachments?.map((file, index) => ({
          id: generateId(),
          type: file.type.startsWith("image/") ? "image" : "document",
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          mimeType: file.type,
        })),
      };

      addMessage(userMessage);
      setIsLoading(true);
      setIsStreaming(true);
      setStreamingContent("");

      // Simulate AI response with streaming
      try {
        const responseText = `สวัสดีครับพี่ชาย! นี่คือ Kimi Clone 🌙

ผมสามารถช่วยพี่ได้หลายอย่าง:

**1. ถามตอบทั่วไป**
- อธิบายความรู้ต่างๆ
- ช่วยแก้ปัญหา
- ให้คำแนะนำ

**2. เขียนโค้ด**
- สร้างเว็บไซต์
- แก้ไขบั๊ก
- อธิบายโค้ด

**3. วิเคราะห์ไฟล์**
- PDF, Word, Excel
- รูปภาพ (OCR)
- โค้ดไฟล์ต่างๆ

**4. สร้างเนื้อหา**
- เขียนอีเมล
- สร้างรายงาน
- แปลภาษา

ลองถามอะไรก็ได้เลยครับ! 😊`;

        // Simulate streaming
        const chunks = responseText.split("");
        for (let i = 0; i < chunks.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 10));
          appendStreamingContent(chunks[i]);
        }

        // Finalize message
        const aiMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: responseText,
          timestamp: new Date(),
          metadata: {
            tokens: responseText.length,
            model: "kimi-k2-5",
            latency: 1200,
          },
        };

        addMessage(aiMessage);
        setStreamingContent("");
      } catch (error) {
        toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
      }
    },
    [addMessage, setIsLoading, setIsStreaming, setStreamingContent, appendStreamingContent]
  );

  const handleStopGeneration = useCallback(() => {
    setIsStreaming(false);
    setIsLoading(false);
    
    // Save partial response
    if (streamingContent) {
      const partialMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: streamingContent,
        timestamp: new Date(),
        metadata: {
          isPartial: true,
        },
      };
      addMessage(partialMessage);
      setStreamingContent("");
    }
  }, [streamingContent, addMessage, setIsStreaming, setIsLoading, setStreamingContent]);

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader />
      
      <ToolBar 
        activeTool={activeTool} 
        onToolSelect={setActiveTool} 
      />

      <div className="flex-1 overflow-hidden relative">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
          virtuosoRef={virtuosoRef}
          onUserScroll={setUserScrolled}
          showScrollButton={showScrollButton}
          onScrollToBottom={() => {
            virtuosoRef.current?.scrollToIndex({
              index: messages.length - 1,
              behavior: "smooth",
              align: "end",
            });
            setUserScrolled(false);
          }}
        />

        <ContextWindowIndicator />
      </div>

      <InputArea
        onSend={handleSendMessage}
        isStreaming={isStreaming}
        onStop={handleStopGeneration}
        activeTool={activeTool}
      />
    </div>
  );
}
