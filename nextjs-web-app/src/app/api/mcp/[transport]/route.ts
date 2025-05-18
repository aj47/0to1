import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";

const handler = createMcpHandler(
  (server) => {
    console.log("server", server);
    server.tool(
      "echo",
      "Echo a message",
      { message: z.string() },
      async ({ message }) => ({
        content: [{ type: "text", text: `Tool echo: ${message}` }],
      })
    );
    
    server.tool(
      "postTwitter",
      "Post a message to Twitter",
      { message: z.string() },
      async ({ message }) => {
        // Call Gumloop API
        const gumloopApiKey = "8ceebb7296b4494187c715cca571f1d0";
        const gumloopUrl = "https://api.gumloop.com/api/v1/start_pipeline";
        const body = JSON.stringify({
          user_id: "b7uJk4uuiaanedV9XFYzSuZ6xdl2",
          saved_item_id: "sygyLEWtnPaDaRgaCkw3hY",
          pipeline_inputs: [{ input_name: "tweet_text", value: message }],
        });
        try {
          const response = await fetch(gumloopUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${gumloopApiKey}`,
            },
            body,
          });
          const data = await response.json();
          return {
            content: [
              { type: "text", text: `Gumloop API response: ${JSON.stringify(data)}` },
            ],
          };
        } catch (error) {
          return {
            content: [
              { type: "text", text: `Error posting to Twitter via Gumloop: ${error}` },
            ],
          };
        }
      }
    );

    server.tool(
      "automateTask",
      "Automate a browser task for a given instruction",
      { task: z.string() },
      async ({ task }) => {
        const apiKey = process.env.BROWSER_USE_API_KEY;
        if (!apiKey) {
          return {
            content: [
              { type: "text", text: "Error: API key is not set in environment variables." },
            ],
          };
        }
        try {
          // Spawn the task
          const response = await fetch("https://api.browser-use.com/api/v1/run-task", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ task }),
          });
          const data = await response.json();
          console.log("data", data);
          if (!data.id) {
            return {
              content: [
                { type: "text", text: `Error: No task id returned from automation API. Response: ${JSON.stringify(data)}` },
              ],
            };
          }
          // Fetch task details
          const detailsResponse = await fetch(`https://api.browser-use.com/api/v1/task/${data.id}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          });
          const details = await detailsResponse.json();
          console.log("details", details);
          return {
            content: [
              { type: "text", text: `Automation response: ${JSON.stringify(data)}` },
              { type: "text", text: `Task details: ${JSON.stringify(details)}` },
            ],
          };
        } catch (error) {
          return {
            content: [
              { type: "text", text: `Error calling automation API: ${error}` },
            ],
          };
        }
      }
    );
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
        postTwitter: {
          description: "Post a message to Twitter",
        },
        automateTask: {
          description: "Automate a browser task for a given instruction",
        },
      },
    },
  },
  {
    redisUrl:"rediss://default:AWbWAAIjcDEwMTQ4MjBiZWE3OGY0OWRjODNkMWFkZmRlYTEwOTFjOHAxMA@exciting-crab-26326.upstash.io:6379",
    basePath: "/api/mcp",
    verboseLogs: true,
    maxDuration: 60,
  }
);

export { handler as GET, handler as POST, handler as DELETE };