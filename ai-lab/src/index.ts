#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { AwsDocumentationService } from './services/aws-docs-service.js';
import { Tool } from './types/tool.js';

// Tool definitions
const tools: Tool[] = [
  {
    name: 'search_aws_docs',
    description: 'Search AWS documentation for specific topics or services',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for AWS documentation',
        },
        service: {
          type: 'string',
          description: 'Optional AWS service name to limit search scope',
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10)',
          default: 10,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_aws_service_docs',
    description: 'Get detailed documentation for a specific AWS service',
    inputSchema: {
      type: 'object',
      properties: {
        serviceName: {
          type: 'string',
          description: 'Name of the AWS service (e.g., ec2, s3, lambda)',
        },
        topic: {
          type: 'string',
          description: 'Optional specific topic within the service documentation',
        },
      },
      required: ['serviceName'],
    },
  },
  {
    name: 'list_aws_services',
    description: 'List all available AWS services with their descriptions',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Optional category to filter services (e.g., compute, storage, database)',
        },
      },
    },
  },
  {
    name: 'get_aws_pricing_info',
    description: 'Get pricing information for AWS services',
    inputSchema: {
      type: 'object',
      properties: {
        serviceName: {
          type: 'string',
          description: 'Name of the AWS service',
        },
        region: {
          type: 'string',
          description: 'AWS region (e.g., us-east-1, eu-west-1)',
        },
      },
      required: ['serviceName'],
    },
  },
];

class AwsDocsMCPServer {
  private server: Server;
  private awsDocsService: AwsDocumentationService;

  constructor() {
    this.server = new Server(
      {
        name: 'aws-docs-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.awsDocsService = new AwsDocumentationService();
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: tools.map((tool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        })),
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_aws_docs':
            return await this.handleSearchAwsDocs(args);
          case 'get_aws_service_docs':
            return await this.handleGetAwsServiceDocs(args);
          case 'list_aws_services':
            return await this.handleListAwsServices(args);
          case 'get_aws_pricing_info':
            return await this.handleGetAwsPricingInfo(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing tool ${name}: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });
  }

  private async handleSearchAwsDocs(args: any) {
    const { query, service, maxResults = 10 } = args;
    const results = await this.awsDocsService.searchDocumentation(query, service, maxResults);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  private async handleGetAwsServiceDocs(args: any) {
    const { serviceName, topic } = args;
    const docs = await this.awsDocsService.getServiceDocumentation(serviceName, topic);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(docs, null, 2),
        },
      ],
    };
  }

  private async handleListAwsServices(args: any) {
    const { category } = args;
    const services = await this.awsDocsService.listServices(category);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(services, null, 2),
        },
      ],
    };
  }

  private async handleGetAwsPricingInfo(args: any) {
    const { serviceName, region } = args;
    const pricing = await this.awsDocsService.getPricingInfo(serviceName, region);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(pricing, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('AWS Docs MCP Server running on stdio');
  }
}

const server = new AwsDocsMCPServer();
server.run().catch(console.error);
