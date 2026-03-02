import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message, Chat, Folder, UserSettings, Tool } from "@/types";

interface ChatState {
  // Current chat
  currentChatId: string | null;
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  streamingContent: string;
  
  // UI State
  sidebarOpen: boolean;
  activeTool: string | null;
  showThinking: boolean;
  contextWindowUsed: number;
  contextWindowTotal: number;
  
  // Actions
  setCurrentChatId: (id: string | null) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  setIsLoading: (loading: boolean) => void;
  setIsStreaming: (streaming: boolean) => void;
  setStreamingContent: (content: string) => void;
  appendStreamingContent: (content: string) => void;
  clearMessages: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveTool: (tool: string | null) => void;
  setShowThinking: (show: boolean) => void;
  setContextWindow: (used: number, total: number) => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  currentChatId: null,
  messages: [],
  isLoading: false,
  isStreaming: false,
  streamingContent: "",
  sidebarOpen: true,
  activeTool: null,
  showThinking: false,
  contextWindowUsed: 0,
  contextWindowTotal: 128000,
  
  setCurrentChatId: (id) => set({ currentChatId: id }),
  
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  
  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),
  
  deleteMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id),
    })),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsStreaming: (streaming) => set({ isStreaming: streaming }),
  setStreamingContent: (content) => set({ streamingContent: content }),
  
  appendStreamingContent: (content) =>
    set((state) => ({
      streamingContent: state.streamingContent + content,
    })),
  
  clearMessages: () => set({ messages: [], streamingContent: "" }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setShowThinking: (show) => set({ showThinking: show }),
  setContextWindow: (used, total) =>
    set({ contextWindowUsed: used, contextWindowTotal: total }),
}));

interface SidebarState {
  searchQuery: string;
  activeTab: "all" | "starred" | "archived";
  selectedFolderId: string | null;
  selectedTags: string[];
  isSearchOpen: boolean;
  
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: "all" | "starred" | "archived") => void;
  setSelectedFolderId: (id: string | null) => void;
  toggleTag: (tag: string) => void;
  setIsSearchOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()((set) => ({
  searchQuery: "",
  activeTab: "all",
  selectedFolderId: null,
  selectedTags: [],
  isSearchOpen: false,
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedFolderId: (id) => set({ selectedFolderId: id }),
  toggleTag: (tag) =>
    set((state) => ({
      selectedTags: state.selectedTags.includes(tag)
        ? state.selectedTags.filter((t) => t !== tag)
        : [...state.selectedTags, tag],
    })),
  setIsSearchOpen: (open) => set({ isSearchOpen: open }),
}));

interface SettingsState {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

const defaultSettings: UserSettings = {
  theme: "system",
  language: "th",
  fontSize: "md",
  enterToSend: true,
  soundEnabled: true,
  notificationsEnabled: true,
  defaultModel: "kimi-k2-5",
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: "kimi-settings",
    }
  )
);
