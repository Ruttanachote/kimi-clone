"use client";

import { useState, useRef, useCallback, KeyboardEvent, useEffect } from "react";
import { Send, Paperclip, Mic, Square, Command, Image, FileText, Search, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/Button";
import { Textarea } from "@/components/common/Textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/Popover";
import { toast } from "sonner";

interface InputAreaProps {
  onSend: (content: string, attachments?: File[]) => void;
  isStreaming: boolean;
  onStop: () => void;
  activeTool?: string | null;
}

const SLASH_COMMANDS = [
  { command: "/image", icon: Image, description: "สร้างรูปภาพจากคำอธิบาย" },
  { command: "/search", icon: Search, description: "ค้นหาข้อมูลจากอินเทอร์เน็ต" },
  { command: "/doc", icon: FileText, description: "สร้างเอกสาร" },
  { command: "/code", icon: Code, description: "เขียนหรือแก้ไขโค้ด" },
];

export function InputArea({ onSend, isStreaming, onStop, activeTool }: InputAreaProps) {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [showCommands, setShowCommands] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(() => {
    if (!input.trim() && files.length === 0) return;
    onSend(input, files.length > 0 ? files : undefined);
    setInput("");
    setFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input, files, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = "auto";
    target.style.height = Math.min(target.scrollHeight, 400) + "px";
    
    // Show slash commands
    if (target.value === "/") {
      setShowCommands(true);
    } else if (!target.value.startsWith("/")) {
      setShowCommands(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      toast.success(`เพิ่มไฟล์ ${newFiles.length} รายการ`);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          setFiles((prev) => [...prev, file]);
          toast.success("แนบรูปภาพจากคลิปบอร์ดแล้ว");
        }
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const insertCommand = (command: string) => {
    setInput(command + " ");
    setShowCommands(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* File previews */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {files.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm border"
              >
                {file.type.startsWith("image/") ? (
                  <Image className="w-4 h-4 text-blue-500" />
                ) : (
                  <FileText className="w-4 h-4 text-orange-500" />
                )}
                <span className="truncate max-w-[150px]">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
                <button
                  onClick={() => removeFile(i)}
                  className="ml-1 text-muted-foreground hover:text-destructive"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="relative flex flex-col gap-2 bg-muted rounded-2xl p-2">
          <Popover open={showCommands} onOpenChange={setShowCommands}>
            <PopoverTrigger asChild>
              <div />
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start" side="top">
              <div className="py-2">
                <p className="px-3 py-1 text-xs font-medium text-muted-foreground">คำสั่ง</p>
                {SLASH_COMMANDS.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.command}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted text-left"
                      onClick={() => insertCommand(cmd.command)}
                    >
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{cmd.command}</p>
                        <p className="text-xs text-muted-foreground">{cmd.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            onPaste={handlePaste}
            placeholder={activeTool 
              ? `ใช้ ${activeTool}... พิมพ์ / สำหรับคำสั่ง` 
              : "ถามอะไรก็ได้... พิมพ์ / สำหรับคำสั่ง"
            }
            disabled={isStreaming}
            className="min-h-[56px] max-h-[400px] bg-transparent border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-3"
          />

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json,.js,.ts,.tsx,.jsx,.html,.css"
                className="hidden"
              />
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => fileInputRef.current?.click()}
                disabled={isStreaming}
              >
                <Paperclip className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", isRecording && "text-red-500 animate-pulse")}
                onClick={() => setIsRecording(!isRecording)}
                disabled={isStreaming}
              >
                <Mic className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowCommands(true)}
                disabled={isStreaming}
              >
                <Command className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Enter เพื่อส่ง · Shift+Enter ขึ้นบรรทัดใหม่
              </span>
              
              {isStreaming ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onStop}
                  className="rounded-full"
                >
                  <Square className="w-4 h-4 mr-1 fill-current" />
                  หยุด
                </Button>
              ) : (
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() && files.length === 0}
                  size="sm"
                  className="rounded-full"
                >
                  <Send className="w-4 h-4 mr-1" />
                  ส่ง
                </Button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-2">
          AI อาจให้ข้อมูลที่ไม่ถูกต้อง โปรดตรวจสอบข้อมูลสำคัญ
        </p>
      </div>
    </div>
  );
}
