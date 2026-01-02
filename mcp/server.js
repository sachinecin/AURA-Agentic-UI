// MCP Server for Trusted Component Catalog

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');

class ComponentCatalogServer {
  constructor() {
    this.server = new Server(
      {
        name: 'component-catalog',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.server.setRequestHandler('tools/list', async () => {
      return {
        tools: [
          {
            name: 'get_component',
            description: 'Get a trusted UI component',
            inputSchema: {
              type: 'object',
              properties: {
                componentId: { type: 'string' },
              },
              required: ['componentId'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      if (name === 'get_component') {
        const component = this.getComponent(args.componentId);
        return { content: [{ type: 'text', text: JSON.stringify(component) }] };
      }

      throw new Error(`Unknown tool: ${name}`);
    });
  }

  getComponent(id) {
    // Placeholder components
    const components = {
      button: { type: 'button', label: 'Click me' },
      input: { type: 'input', placeholder: 'Enter text' },
    };
    return components[id] || null;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('MCP Component Catalog Server running');
  }
}

const server = new ComponentCatalogServer();
server.run().catch(console.error);