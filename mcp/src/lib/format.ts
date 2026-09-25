// Response helpers — return both human-readable text and structured data,
// per the MCP TypeScript SDK (content + structuredContent).

export interface ToolResult {
  [x: string]: unknown;
  content: { type: "text"; text: string }[];
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
}

export function ok(text: string, structured?: Record<string, unknown>): ToolResult {
  return {
    content: [{ type: "text", text }],
    ...(structured ? { structuredContent: structured } : {}),
  };
}

export function fail(text: string): ToolResult {
  return { content: [{ type: "text", text }], isError: true };
}

export function sdg(n: number): string {
  return `${n.toLocaleString("en-US")} SDG`;
}
