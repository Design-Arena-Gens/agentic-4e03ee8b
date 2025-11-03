import { runAgent, AgentMessage } from "@/lib/agent";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const incoming = Array.isArray(body?.messages) ? body.messages : [];

    const messages: AgentMessage[] = incoming
      .filter(
        (entry: AgentMessage) =>
          typeof entry?.content === "string" && entry.content.trim().length > 0
      )
      .map((entry: AgentMessage) => ({
        role: entry.role === "assistant" || entry.role === "system" ? entry.role : "user",
        content: entry.content.trim(),
        createdAt: entry.createdAt,
      }));

    const response = await runAgent(messages);

    return NextResponse.json(
      {
        message: {
          role: response.role,
          content: response.content,
          intent: response.intent,
          suggestions: response.suggestions,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[agent-route-error]", error);
    return NextResponse.json(
      {
        error: "Unable to process your request right now. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}
