"use client";

import { useChatStore } from "@/store";
import { formatTokens } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/common/Tooltip";

export function ContextWindowIndicator() {
  const { contextWindowUsed, contextWindowTotal } = useChatStore();
  const percentage = (contextWindowUsed / contextWindowTotal) * 100;
  
  let colorClass = "bg-green-500";
  if (percentage > 50) colorClass = "bg-yellow-500";
  if (percentage > 80) colorClass = "bg-orange-500";
  if (percentage > 95) colorClass = "bg-red-500";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-muted/80 backdrop-blur rounded-full text-xs cursor-help">
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${colorClass} transition-all duration-300`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <span className="text-muted-foreground">
              {formatTokens(contextWindowUsed)} / {formatTokens(contextWindowTotal)}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Context Window Usage</p>
          <p className="text-muted-foreground">
            {formatTokens(contextWindowUsed)} tokens used
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
