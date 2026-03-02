"use client";

import { useState, useRef } from "react";
import {
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Share,
  MoreHorizontal,
  Quote,
  GitBranch,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/common/ContextMenu";
import { Avatar, AvatarFallback } from "@/components/common/Avatar";
import type { Message } from "@/types";
import { formatDate, copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageItemProps {
  message: Message;
  isLast?: boolean;
  isStreaming?: boolean;
}

export function MessageItem({ message, isLast, isStreaming }: MessageItemProps) {
  const [copied, setCopied] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await copyToClipboard(message.content);
    setCopied(true);
    toast.success("คัดลอกแล้ว");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    toast.info("กำลังสร้างคำตอบใหม่...");
  };

  const handleBranch = () => {
    toast.info("สร้าง branch ใหม่");
  };

  const handleQuote = () => {
    toast.info("อ้างอิงข้อความ");
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "group relative py-4 px-4 md:px-8 hover:bg-muted/30 transition-colors",
            isUser ? "bg-muted/20" : "bg-background"
          )}
        >
          <div className="max-w-4xl mx-auto flex gap-4">
            {/* Avatar */}
            <Avatar className={cn(
              "w-8 h-8 shrink-0",
              isUser ? "bg-primary" : "bg-gradient-to-br from-orange-400 to-pink-500"
            )}>
              <AvatarFallback className={cn(
                "text-sm font-medium",
                isUser ? "text-primary-foreground" : "text-white"
              )}>
                {isUser ? "ฉ" : "🌙"}
              </AvatarFallback>
            </Avatar>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Header */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  {isUser ? "คุณ" : "Kimi"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(message.timestamp, "short")}
                </span>
                {message.metadata?.model && (
                  <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {message.metadata.model}
                  </span>
                )}
              </div>

              {/* Thinking Section */}
              {message.metadata?.isThinking && message.metadata.thinkingContent && (
                <div className="mb-2">
                  <button
                    onClick={() => setShowThinking(!showThinking)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-kimi-orange animate-pulse" />
                      <span>กำลังคิด...</span>
                    </div>
                    <span className="text-xs">{showThinking ? "▲" : "▼"}</span>
                  </button>
                  
                  {showThinking && (
                    <div className="mt-2 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground border-l-2 border-kimi-orange">
                      {message.metadata.thinkingContent}
                    </div>
                  )}
                </div>
              )}

              {/* Message Content */}
              <div className={cn(
                "prose prose-sm dark:prose-invert max-w-none",
                isStreaming && "after:content-['▌'] after:animate-pulse after:text-primary"
              )}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>

              {/* Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {message.attachments.map((att) => (
                    <AttachmentPreview key={att.id} attachment={att} />
                  ))}
                </div>
              )}

              {/* Citations */}
              {message.citations && message.citations.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">อ้างอิง:</p>
                  {message.citations.map((cite) => (
                    <a
                      key={cite.id}
                      href={cite.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded shrink-0">
                        {cite.index}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{cite.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{cite.snippet}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* Actions */}
              {!isUser && !isStreaming && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRegenerate}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleQuote}>
                        <Quote className="w-4 h-4 mr-2" />
                        อ้างอิง
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleBranch}>
                        <GitBranch className="w-4 h-4 mr-2" />
                        สร้าง branch
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Share className="w-4 h-4 mr-2" />
                        แชร์ข้อความ
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* Token info */}
              {message.metadata?.tokens && (
                <div className="text-xs text-muted-foreground pt-1">
                  {message.metadata.tokens.toLocaleString()} tokens
                  {message.metadata.latency && ` · ${message.metadata.latency}ms`}
                </div>
              )}
            </div>
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem onClick={handleCopy}>
          <Copy className="w-4 h-4 mr-2" />
          คัดลอก
        </ContextMenuItem>
        <ContextMenuItem onClick={handleQuote}>
          <Quote className="w-4 h-4 mr-2" />
          อ้างอิง
        </ContextMenuItem>
        <ContextMenuItem onClick={handleBranch}>
          <GitBranch className="w-4 h-4 mr-2" />
          สร้าง branch
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleRegenerate}>
          <RotateCcw className="w-4 h-4 mr-2" />
          สร้างใหม่
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function AttachmentPreview({ attachment }: { attachment: Message["attachments"][0] }) {
  const isImage = attachment.type === "image";
  
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border max-w-xs">
      {isImage ? (
        <img
          src={attachment.url}
          alt={attachment.name}
          className="w-10 h-10 object-cover rounded"
        />
      ) : (
        <FileText className="w-10 h-10 p-2 text-muted-foreground" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{attachment.name}</p>
        <p className="text-xs text-muted-foreground">
          {(attachment.size / 1024).toFixed(1)} KB
        </p>
      </div>
    </div>
  );
}
