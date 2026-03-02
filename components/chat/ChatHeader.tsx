"use client";

import { useState } from "react";
import {
  PanelLeft,
  Share2,
  Settings,
  MoreHorizontal,
  Star,
  Archive,
  Trash2,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";
import { useChatStore } from "@/store";
import { toast } from "sonner";

export function ChatHeader() {
  const { sidebarOpen, setSidebarOpen, currentChatId } = useChatStore();
  const [isStarred, setIsStarred] = useState(false);

  const handleShare = () => {
    toast.success("คัดลอกลิงก์แชร์แล้ว");
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden"
        >
          <PanelLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-lg">
            {currentChatId ? "Chat Session" : "New Chat"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsStarred(!isStarred)}
          className={isStarred ? "text-yellow-500" : ""}
        >
          <Star className={`w-5 h-5 ${isStarred ? "fill-current" : ""}`} />
        </Button>

        <Button variant="ghost" size="icon" onClick={handleShare}>
          <Share2 className="w-5 h-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit3 className="w-4 h-4 mr-2" />
              แก้ไขชื่อ
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="w-4 h-4 mr-2" />
              เก็บถาวร
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              ลบแชท
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
