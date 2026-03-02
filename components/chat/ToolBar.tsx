"use client";

import { Globe, FileText, Presentation, Table, Search, Bot, Code, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const TOOLS = [
  { id: "web", icon: Globe, label: "Web Builder", description: "สร้างเว็บไซต์", color: "text-blue-500" },
  { id: "doc", icon: FileText, label: "Document", description: "สร้างเอกสาร", color: "text-green-500" },
  { id: "ppt", icon: Presentation, label: "Presentation", description: "สร้างสไลด์", color: "text-orange-500" },
  { id: "sheet", icon: Table, label: "Spreadsheet", description: "สร้างตาราง", color: "text-emerald-500" },
  { id: "research", icon: Search, label: "Research", description: "ค้นคว้าลึก", color: "text-purple-500" },
  { id: "agent", icon: Bot, label: "Agent Swarm", description: "หลาย Agent", color: "text-pink-500", isBeta: true },
  { id: "code", icon: Code, label: "Code", description: "เขียนโค้ด", color: "text-cyan-500" },
  { id: "kimi+", icon: Sparkles, label: "Kimi+", description: "ฟีเจอร์พิเศษ", color: "text-kimi-orange" },
];

interface ToolBarProps {
  activeTool: string | null;
  onToolSelect: (tool: string | null) => void;
}

export function ToolBar({ activeTool, onToolSelect }: ToolBarProps) {
  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b overflow-x-auto scrollbar-hide">
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;
        
        return (
          <button
            key={tool.id}
            onClick={() => onToolSelect(isActive ? null : tool.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            title={tool.description}
          >
            <Icon className={cn("w-4 h-4", tool.color)} />
            <span>{tool.label}</span>
            {tool.isBeta && (
              <span className="text-[10px] bg-orange-500 text-white px-1 rounded font-bold">
                BETA
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
