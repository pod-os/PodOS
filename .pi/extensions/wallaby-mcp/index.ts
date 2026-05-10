import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const MCP_COMMAND = process.env.WALLABY_MCP_COMMAND ?? "node";
const MCP_ARGS = (
  process.env.WALLABY_MCP_ARGS ?? "/home/node/.wallaby/mcp/"
).split(" ");

export default async function (pi: ExtensionAPI) {
  let client: Client | null = null;

  async function connect(): Promise<Client | null> {
    if (client) return client;

    try {
      const transport = new StdioClientTransport({
        command: MCP_COMMAND,
        args: MCP_ARGS,
        stderr: "pipe",
      });
      client = new Client({ name: "pi-wallaby", version: "1.0.0" });
      await client.connect(transport);
      return client;
    } catch (e) {
      return null;
    }
  }

  const c = await connect();

  if (c) {
    const { tools } = await c.listTools();

    for (const tool of tools) {
      pi.registerTool({
        name: `wallaby_${tool.name}`,
        label: `Wallaby: ${tool.name}`,
        description: tool.description ?? `Wallaby tool: ${tool.name}`,
        promptSnippet: tool.description ?? `Wallaby: ${tool.name}`,
        parameters: Type.Object(
          Object.fromEntries(
            Object.entries((tool.inputSchema as any)?.properties ?? {}).map(
              ([key, schema]: [string, any]) => [
                key,
                schema.type === "number"
                  ? Type.Optional(
                      Type.Number({ description: schema.description }),
                    )
                  : schema.type === "boolean"
                    ? Type.Optional(
                        Type.Boolean({ description: schema.description }),
                      )
                    : Type.Optional(
                        Type.String({ description: schema.description }),
                      ),
              ],
            ),
          ),
        ),
        async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
          if (!client) {
            throw new Error(
              "Wallaby MCP server not running. Start Wallaby in your editor and run /wallaby-reconnect",
            );
          }

          const result = await client.callTool({
            name: tool.name,
            arguments: params,
          });

          const text = (result.content as any[])
            .filter((c) => c.type === "text")
            .map((c) => c.text)
            .join("\n");

          return {
            content: [{ type: "text", text: text || "No output from Wallaby" }],
            details: { toolName: tool.name, params },
          };
        },
      });
    }
  }

  pi.registerCommand("wallaby-reconnect", {
    description: "Reconnect to Wallaby MCP server",
    handler: async (_args, ctx) => {
      if (client) {
        await client.close().catch(() => {});
        client = null;
      }
      const c = await connect();
      if (c) {
        ctx.ui.notify(
          "Connected to Wallaby MCP. Run /reload to register tools.",
          "success",
        );
      } else {
        ctx.ui.notify("Failed to connect to Wallaby MCP", "error");
      }
    },
  });

  pi.on("session_shutdown", async () => {
    if (client) {
      await client.close().catch(() => {});
      client = null;
    }
  });
}
