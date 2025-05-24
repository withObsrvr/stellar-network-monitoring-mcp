#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { StellarNetworkApiClient } from './api/client.js';
import { NetworkTools } from './tools/network.js';
import { NodeTools } from './tools/nodes.js';
import { OrganizationTools } from './tools/organizations.js';
import { logger } from './utils/logger.js';

class StellarNetworkMonitoringServer {
  private server: Server;
  private apiClient: StellarNetworkApiClient;
  private networkTools: NetworkTools;
  private nodeTools: NodeTools;
  private organizationTools: OrganizationTools;

  constructor() {
    this.server = new Server(
      {
        name: 'stellar-network-monitoring-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    const isTestnet = process.env.STELLAR_NETWORK === 'testnet';
    this.apiClient = new StellarNetworkApiClient(undefined, isTestnet);
    this.networkTools = new NetworkTools(this.apiClient);
    this.nodeTools = new NodeTools(this.apiClient);
    this.organizationTools = new OrganizationTools(this.apiClient);

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          this.networkTools.getNetworkStatusTool(),
          this.networkTools.getNetworkStatisticsTool(),
          this.networkTools.checkNetworkConsensusTool(),
          this.nodeTools.getAllNodesTool(),
          this.nodeTools.getNodeDetailsTool(),
          this.nodeTools.checkNodeHealthTool(),
          this.nodeTools.findFailingNodesTool(),
          this.nodeTools.getValidatorNodesTool(),
          this.organizationTools.getAllOrganizationsTool(),
          this.organizationTools.getOrganizationDetailsTool(),
          this.organizationTools.analyzeOrganizationReliabilityTool(),
          this.organizationTools.getOrganizationNodesTool(),
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result: any;

        switch (name) {
          case 'get_network_status':
            result = await this.networkTools.handleGetNetworkStatus(args as any);
            break;
          case 'get_network_statistics':
            result = await this.networkTools.handleGetNetworkStatistics(args as any);
            break;
          case 'check_network_consensus':
            result = await this.networkTools.handleCheckNetworkConsensus(args as any);
            break;
          case 'get_all_nodes':
            result = await this.nodeTools.handleGetAllNodes(args as any);
            break;
          case 'get_node_details':
            result = await this.nodeTools.handleGetNodeDetails(args as any);
            break;
          case 'check_node_health':
            result = await this.nodeTools.handleCheckNodeHealth(args as any);
            break;
          case 'find_failing_nodes':
            result = await this.nodeTools.handleFindFailingNodes(args as any);
            break;
          case 'get_validator_nodes':
            result = await this.nodeTools.handleGetValidatorNodes(args as any);
            break;
          case 'get_all_organizations':
            result = await this.organizationTools.handleGetAllOrganizations();
            break;
          case 'get_organization_details':
            result = await this.organizationTools.handleGetOrganizationDetails(args as any);
            break;
          case 'analyze_organization_reliability':
            result = await this.organizationTools.handleAnalyzeOrganizationReliability(args as any);
            break;
          case 'get_organization_nodes':
            result = await this.organizationTools.handleGetOrganizationNodes(args as any);
            break;
          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error(`Error executing tool ${name}`, { error: error instanceof Error ? error.message : String(error), args });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
                tool: name,
                timestamp: new Date().toISOString()
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('Stellar Network Monitoring MCP Server started');
  }
}

async function main(): Promise<void> {
  const server = new StellarNetworkMonitoringServer();
  await server.run();
}

if (require.main === module) {
  main().catch((error) => {
    logger.error('Server failed to start', { error: error instanceof Error ? error.message : String(error) });
    process.exit(1);
  });
}

export { StellarNetworkMonitoringServer };