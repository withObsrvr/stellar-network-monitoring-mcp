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
import { WorkflowTools } from './tools/workflows.js';
import { logger } from './utils/logger.js';

class StellarNetworkMonitoringServer {
  private server: Server;
  private apiClient: StellarNetworkApiClient;
  private networkTools: NetworkTools;
  private nodeTools: NodeTools;
  private organizationTools: OrganizationTools;
  private workflowTools: WorkflowTools;

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
    this.workflowTools = new WorkflowTools(this.apiClient);

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // High-Level Workflow Tools (LLM-Optimized)
          this.workflowTools.investigateNetworkIssuesTool(),
          this.workflowTools.monitorValidatorPerformanceTool(),
          this.workflowTools.analyzeOrganizationHealthTool(),
          this.workflowTools.analyzeNetworkDiversityTool(),
          this.workflowTools.troubleshootConsensusIssuesTool(),
          
          // Core Network Tools
          this.networkTools.getNetworkStatusTool(),
          this.networkTools.checkNetworkConsensusTool(),
          this.networkTools.detectNetworkIssuesTool(),
          this.networkTools.analyzeNetworkTrendsTool(),
          this.networkTools.generateNetworkReportTool(),
          
          // Essential Node Tools
          this.nodeTools.searchNodesTool(),
          this.nodeTools.checkNodeHealthTool(),
          this.nodeTools.findFailingNodesTool(),
          this.nodeTools.getValidatorNodesTool(),
          this.nodeTools.compareNodesTool(),
          this.nodeTools.rankValidatorsTool(),
          
          // Organization Tools
          this.organizationTools.getOrganizationDetailsTool(),
          this.organizationTools.getOrganizationNodesTool(),
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result: any;

        switch (name) {
          // High-Level Workflow Tools
          case 'investigate_network_issues':
            result = await this.workflowTools.handleInvestigateNetworkIssues(args as any);
            break;
          case 'monitor_validator_performance':
            result = await this.workflowTools.handleMonitorValidatorPerformance(args as any);
            break;
          case 'analyze_organization_health':
            result = await this.workflowTools.handleAnalyzeOrganizationHealth(args as any);
            break;
          case 'analyze_network_diversity':
            result = await this.workflowTools.handleAnalyzeNetworkDiversity(args as any);
            break;
          case 'troubleshoot_consensus_issues':
            result = await this.workflowTools.handleTroubleshootConsensusIssues(args as any);
            break;

          // Core Network Tools
          case 'get_network_status':
            result = await this.networkTools.handleGetNetworkStatus(args as any);
            break;
          case 'check_network_consensus':
            result = await this.networkTools.handleCheckNetworkConsensus(args as any);
            break;
          case 'detect_network_issues':
            result = await this.networkTools.handleDetectNetworkIssues(args as any);
            break;
          case 'analyze_network_trends':
            result = await this.networkTools.handleAnalyzeNetworkTrends(args as any);
            break;
          case 'generate_network_report':
            result = await this.networkTools.handleGenerateNetworkReport(args as any);
            break;

          // Essential Node Tools
          case 'search_nodes':
            result = await this.nodeTools.handleSearchNodes(args as any);
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
          case 'compare_nodes':
            result = await this.nodeTools.handleCompareNodes(args as any);
            break;
          case 'rank_validators':
            result = await this.nodeTools.handleRankValidators(args as any);
            break;

          // Organization Tools
          case 'get_organization_details':
            result = await this.organizationTools.handleGetOrganizationDetails(args as any);
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