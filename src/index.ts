import { env } from 'cloudflare:workers';

import { createMcpAgent } from '@cloudflare/playwright-mcp';

/**
 * An instance of the Playwright MCP agent.
 * This agent is created using the browser binding from the environment.
 * @see https://github.com/cloudflare/playwright-mcp
 */
export const PlaywrightMCP = createMcpAgent(env.BROWSER);

/**
 * The main Cloudflare Worker object.
 * It handles incoming requests and routes them to the appropriate MCP endpoint.
 */
export default {
  /**
   * The fetch handler for the Cloudflare Worker.
   * It takes an incoming request and routes it to the correct MCP service endpoint.
   *
   * @param request - The incoming request.
   * @param env - The environment variables, including the browser binding.
   * @param ctx - The execution context.
   * @returns A response from the MCP service or a 404 Not Found response.
   */
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const { pathname }  = new URL(request.url);

    switch (pathname) {
      case '/sse':
      case '/sse/message':
        return PlaywrightMCP.serveSSE('/sse').fetch(request, env, ctx);
      case '/mcp':
        return PlaywrightMCP.serve('/mcp').fetch(request, env, ctx);
      default:
        return new Response('Not Found', { status: 404 });
    }
  },
};
