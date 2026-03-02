"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  Star,
  Archive,
  Folder,
  Settings,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit3,
  MoreHorizontal,
  Clock,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { ScrollArea } from "@/components/common/ScrollArea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";
import { useChatStore, useSidebarStore } from "@/store";
import { generateId, formatDate, groupMessagesByDate } from "@/lib/utils";
import type { Chat, Folder as FolderType } from "@/types";

const SAMPLE_CHATS: Chat[] = [
  {
    id: "1",
    title: "Clone Kimi Project",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
    isStarred: true,
    isArchived: false,
    isShared: false,
    settings: { model: "kimi-k2-5", temperature: 0.7, maxTokens: 4096, topP: 1, frequencyPenalty: 0, presencePenalty: 0, jsonMode: false },
  },
  {
    id: "2",
    title: "Python Tutorial",
    messages: [],
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
    tags: [],
    isStarred: false,
    isArchived: false,
    isShared: false,
    settings: { model: "kimi-k2-5", temperature: 0.7, maxTokens: 4096, topP: 1, frequencyPenalty: 0, presencePenalty: 0, jsonMode: false },
  },
  {
    id: "3",
    title: "เที่ยวเชียงใหม่วันหยุด",
    messages: [],
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
    tags: [],
    isStarred: false,
    isArchived: false,
    isShared: false,
    settings: { model: "kimi-k2-5", temperature: 0.7, maxTokens: 4096, topP: 1, frequencyPenalty: 0, presencePenalty: 0, jsonMode: false },
  },
];

const SAMPLE_FOLDERS: FolderType[] = [
  { id: "1", name: "งาน", color: "#7C4DFF", icon: "folder", createdAt: new Date() },
  { id: "2", name: "ส่วนตัว", color: "#1DE9B6", icon: "folder", createdAt: new Date() },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, setCurrentChatId, clearMessages } = useChatStore();
  const {
    searchQuery,
    activeTab,
    selectedFolderId,
    selectedTags,
    isSearchOpen,
    setSearchQuery,
    setActiveTab,
    setSelectedFolderId,
    setIsSearchOpen,
  } = useSidebarStore();

  const [chats, setChats] = useState(SAMPLE_CHATS);
  const [folders] = useState(SAMPLE_FOLDERS);

  const filteredChats = useMemo(() => {
    let result = chats;

    // Filter by tab
    if (activeTab === "starred") {
      result = result.filter((c) => c.isStarred);
    } else if (activeTab === "archived") {
      result = result.filter((c) => c.isArchived);
    } else {
      result = result.filter((c) => !c.isArchived);
    }

    // Filter by folder
    if (selectedFolderId) {
      result = result.filter((c) => c.folderId === selectedFolderId);
    }

    // Filter by search
    if (searchQuery) {
      result = result.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [chats, activeTab, selectedFolderId, searchQuery]);

  const groupedChats = useMemo(() => {
    return groupMessagesByDate(filteredChats.map(c => ({ ...c, timestamp: c.updatedAt })));
  }, [filteredChats]);

  const handleNewChat = () => {
    setCurrentChatId(null);
    clearMessages();
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
  };

  const handleToggleStar = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, isStarred: !c.isStarred } : c))
    );
  };

  if (!sidebarOpen) {
    return (
      <div className="w-12 border-r bg-muted/30 flex flex-col items-center py-4 gap-2">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <ChevronRight className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleNewChat}>
          <Plus className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MessageSquare className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <aside className="w-72 border-r bg-muted/30 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button
            className="flex-1 justify-start gap-2"
            onClick={handleNewChat}
          >
            <Plus className="w-4 h-4" />
            แชทใหม่
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="ml-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาแชท..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-muted rounded-lg">
          {[
            { id: "all", icon: MessageSquare, label: "ทั้งหมด" },
            { id: "starred", icon: Star, label: "ติดดาว" },
            { id: "archived", icon: Archive, label: "เก็บถาวร" },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors",
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Folders */}
        {folders.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground px-2">โฟลเดอร์</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() =>
                    setSelectedFolderId(
                      selectedFolderId === folder.id ? null : folder.id
                    )
                  }
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors",
                    selectedFolderId === folder.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                  style={
                    selectedFolderId !== folder.id
                      ? { backgroundColor: folder.color + "20", color: folder.color }
                      : undefined
                  }
                >
                  <Folder className="w-3.5 h-3.5" />
                  {folder.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-4 pb-4">
          {groupedChats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">ไม่พบแชท</p>
            </div>
          ) : (
            groupedChats.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((chat: any) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      onDelete={handleDeleteChat}
                      onToggleStar={handleToggleStar}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Settings className="w-4 h-4" />
          ตั้งค่า
        </Button>
      </div>
    </aside>
  );
}

function ChatItem({
  chat,
  onDelete,
  onToggleStar,
}: {
  chat: Chat;
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
}) {
  const { currentChatId, setCurrentChatId } = useChatStore();
  const isActive = currentChatId === chat.id;

  return (
    <div
      className={cn(
        "group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors",
        isActive ? "bg-primary/10" : "hover:bg-muted"
      )}
      onClick={() => setCurrentChatId(chat.id)}
    >
      <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
      
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm truncate", isActive && "font-medium")}>
          {chat.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(chat.updatedAt, "relative")}
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-6 w-6", chat.isStarred && "text-yellow-500 opacity-100")}
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(chat.id);
          }}
        >
          <Star className={cn("w-3.5 h-3.5", chat.isStarred && "fill-current")} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="w-3.5 h-3.5" />
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
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(chat.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              ลบ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
