"use client";

export function TypingIndicator() {
  return (
    <div className="py-4 px-4 md:px-8">
      <div className="max-w-4xl mx-auto flex gap-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shrink-0">
          <span className="text-white text-sm">🌙</span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
          <p className="text-sm text-muted-foreground mt-2">กำลังคิด... (ตรวจสอบข้อมูล)</p>
        </div>
      </div>
    </div>
  );
}
