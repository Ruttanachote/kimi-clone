export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  citations?: Citation[];
  metadata?: MessageMetadata;
  parentId?: string;
  branchId?: string;
}

export interface Attachment {
  id: string;
  type: "image" | "document" | "code" | "audio" | "video";
  name: string;
  url: string;
  size: number;
  mimeType: string;
  preview?: string;
}

export interface Citation {
  id: string;
  title: string;
  url: string;
  snippet: string;
  index: number;
}

export interface MessageMetadata {
  tokens?: number;
  model?: string;
  temperature?: number;
  latency?: number;
  isThinking?: boolean;
  thinkingContent?: string;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  folderId?: string;
  tags: string[];
  isStarred: boolean;
  isArchived: boolean;
  isShared: boolean;
  settings: ChatSettings;
}

export interface ChatSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  jsonMode: boolean;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  settings: UserSettings;
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  language: string;
  fontSize: "sm" | "md" | "lg";
  enterToSend: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  defaultModel: string;
  customInstructions?: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  isBeta?: boolean;
}

export interface SearchResult {
  id: string;
  type: "chat" | "message" | "file";
  title: string;
  content: string;
  chatId?: string;
  timestamp: Date;
  highlights: string[];
}

export interface ExportOptions {
  format: "pdf" | "docx" | "markdown" | "json";
  includeMetadata: boolean;
  includeTimestamps: boolean;
  includeAttachments: boolean;
  theme: "light" | "dark";
}
