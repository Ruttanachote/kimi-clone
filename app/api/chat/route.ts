import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, model = "kimi-k2-5", temperature = 0.7, maxTokens = 4096 } = body;

    // Simulate streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const response = "สวัสดีครับพี่ชาย! นี่คือ Kimi Clone 🌙\n\nผมสามารถช่วยคุณได้หลายอย่าง ลองถามมาได้เลย!";
        
        // Stream character by character
        for (const char of response) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          const data = JSON.stringify({ content: char, done: false });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
        
        // End stream
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
