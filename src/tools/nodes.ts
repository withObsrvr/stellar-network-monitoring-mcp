import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { StellarNetworkApiClient } from '../api/client.js';
import { logger } from '../utils/logger.js';
import { Node, HealthCheck } from '../types/index.js';

export class NodeTools {
  constructor(private client: StellarNetworkApiClient) {}

  getAllNodesTool(): Tool {
    return {
      name: 'get_all_nodes',
      description: 'List all nodes with current status and basic information',
      inputSchema: {
        type: 'object',
        properties: {
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
          },
          activeOnly: {
            type: 'boolean',
            description: 'Filter to only return active nodes (default: false)'
          }
        }
      }
    };
  }

  getNodeDetailsTool(): Tool {
    return {
      name: 'get_node_details',
      description: 'Get detailed information about a specific node',
      inputSchema: {
        type: 'object',
        properties: {
          publicKey: {
            type: 'string',
            description: 'The public key of the node to get details for'
          },
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
          }
        },
        required: ['publicKey']
      }
    };
  }

  checkNodeHealthTool(): Tool {
    return {
      name: 'check_node_health',
      description: 'Assess health status of a specific node',
      inputSchema: {
        type: 'object',
        properties: {
          publicKey: {
            type: 'string',
            description: 'The public key of the node to check health for'
          }
        },
        required: ['publicKey']
      }
    };
  }

  findFailingNodesTool(): Tool {
    return {
      name: 'find_failing_nodes',
      description: 'Identify nodes with issues or poor performance',
      inputSchema: {
        type: 'object',
        properties: {
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
          },
          severity: {
            type: 'string',
            enum: ['all', 'critical', 'warning'],
            description: 'Filter by issue severity (default: all)'
          }
        }
      }
    };
  }

  getValidatorNodesTool(): Tool {
    return {
      name: 'get_validator_nodes',
      description: 'List validator nodes with voting status and metrics',
      inputSchema: {
        type: 'object',
        properties: {
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
          },
          activeOnly: {
            type: 'boolean',
            description: 'Filter to only return active validators (default: true)'
          }
        }
      }
    };
  }

  async handleGetAllNodes(args: { at?: string; activeOnly?: boolean }): Promise<any> {
    try {
      logger.info('Fetching all nodes', { at: args.at, activeOnly: args.activeOnly });
      
      const response = await this.client.getAllNodes(args.at);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch nodes');
      }

      let nodes = response.data;
      
      if (args.activeOnly) {
        nodes = nodes.filter(node => node.active);
      }

      return {
        nodes: nodes.map(node => ({
          publicKey: node.publicKey,
          name: node.name,
          host: node.host,
          port: node.port,
          active: node.active,
          validating: node.validating,
          overLoaded: node.overLoaded,
          stellarCoreVersion: node.stellarCoreVersion,
          organizationId: node.organizationId,
          geography: node.geography,
          uptime: node.uptime,
          lastSeen: node.lastSeen
        })),
        summary: {
          total: nodes.length,
          active: nodes.filter(n => n.active).length,
          validators: nodes.filter(n => n.validating).length,
          overloaded: nodes.filter(n => n.overLoaded).length
        }
      };
    } catch (error) {
      logger.error('Error fetching all nodes', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to get all nodes: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleGetNodeDetails(args: { publicKey: string; at?: string }): Promise<Node> {
    try {
      logger.info('Fetching node details', { publicKey: args.publicKey, at: args.at });
      
      const response = await this.client.getNodeByPublicKey(args.publicKey, args.at);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch node details');
      }

      return response.data;
    } catch (error) {
      logger.error('Error fetching node details', { error: error instanceof Error ? error.message : String(error), publicKey: args.publicKey });
      throw new Error(`Failed to get node details: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleCheckNodeHealth(args: { publicKey: string }): Promise<HealthCheck> {
    try {
      logger.info('Checking node health', { publicKey: args.publicKey });
      
      const response = await this.client.getNodeByPublicKey(args.publicKey);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch node for health check');
      }

      const node = response.data;
      const issues: string[] = [];
      let score = 100;

      if (!node.active) {
        issues.push('Node is not active');
        score -= 40;
      }

      if (node.overLoaded) {
        issues.push('Node is overloaded');
        score -= 20;
      }

      if (node.uptime !== undefined && node.uptime < 95) {
        issues.push(`Low uptime: ${node.uptime}%`);
        score -= Math.max(0, (95 - node.uptime) * 2);
      }

      if (!node.stellarCoreVersion) {
        issues.push('Stellar Core version not reported');
        score -= 10;
      }

      if (node.validating && !node.active) {
        issues.push('Validator is offline');
        score -= 30;
      }

      const status = this.determineHealthStatus(score);

      return {
        status,
        issues,
        score: Math.max(0, Math.round(score))
      };
    } catch (error) {
      logger.error('Error checking node health', { error: error instanceof Error ? error.message : String(error), publicKey: args.publicKey });
      throw new Error(`Failed to check node health: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleFindFailingNodes(args: { at?: string; severity?: string }): Promise<any> {
    try {
      logger.info('Finding failing nodes', { at: args.at, severity: args.severity });
      
      const response = await this.client.getAllNodes(args.at);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch nodes');
      }

      const nodes = response.data;
      const failingNodes: Array<{ node: Node; issues: string[]; severity: string }> = [];

      for (const node of nodes) {
        const issues: string[] = [];
        let severity = 'warning';

        if (!node.active) {
          issues.push('Node is offline');
          severity = 'critical';
        }

        if (node.overLoaded) {
          issues.push('Node is overloaded');
          if (node.validating) {
            severity = 'critical';
          }
        }

        if (node.uptime !== undefined && node.uptime < 90) {
          issues.push(`Low uptime: ${node.uptime}%`);
          if (node.uptime < 80) {
            severity = 'critical';
          }
        }

        if (node.validating && !node.active) {
          issues.push('Validator is offline');
          severity = 'critical';
        }

        if (issues.length > 0) {
          if (!args.severity || args.severity === 'all' || 
              (args.severity === 'critical' && severity === 'critical') ||
              (args.severity === 'warning' && ['warning', 'critical'].includes(severity))) {
            failingNodes.push({
              node: {
                publicKey: node.publicKey,
                name: node.name,
                host: node.host,
                active: node.active,
                validating: node.validating,
                overLoaded: node.overLoaded,
                uptime: node.uptime,
                organizationId: node.organizationId
              },
              issues,
              severity
            });
          }
        }
      }

      return {
        failingNodes,
        summary: {
          total: failingNodes.length,
          critical: failingNodes.filter(fn => fn.severity === 'critical').length,
          warning: failingNodes.filter(fn => fn.severity === 'warning').length,
          validatorsAffected: failingNodes.filter(fn => fn.node.validating).length
        }
      };
    } catch (error) {
      logger.error('Error finding failing nodes', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to find failing nodes: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleGetValidatorNodes(args: { at?: string; activeOnly?: boolean }): Promise<any> {
    try {
      logger.info('Fetching validator nodes', { at: args.at, activeOnly: args.activeOnly });
      
      const response = await this.client.getAllNodes(args.at);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch nodes');
      }

      let validators = response.data.filter(node => node.validating);
      
      if (args.activeOnly !== false) {
        validators = validators.filter(node => node.active);
      }

      return {
        validators: validators.map(validator => ({
          publicKey: validator.publicKey,
          name: validator.name,
          host: validator.host,
          active: validator.active,
          validating: validator.validating,
          overLoaded: validator.overLoaded,
          stellarCoreVersion: validator.stellarCoreVersion,
          organizationId: validator.organizationId,
          geography: validator.geography,
          uptime: validator.uptime,
          quorumSet: validator.quorumSet,
          lastSeen: validator.lastSeen
        })),
        summary: {
          total: validators.length,
          active: validators.filter(v => v.active).length,
          overloaded: validators.filter(v => v.overLoaded).length,
          byOrganization: this.groupValidatorsByOrganization(validators)
        }
      };
    } catch (error) {
      logger.error('Error fetching validator nodes', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to get validator nodes: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private determineHealthStatus(score: number): 'healthy' | 'warning' | 'critical' {
    if (score >= 80) return 'healthy';
    if (score >= 60) return 'warning';
    return 'critical';
  }

  private groupValidatorsByOrganization(validators: Node[]): Record<string, number> {
    return validators.reduce((acc, validator) => {
      const org = validator.organizationId || 'Unknown';
      acc[org] = (acc[org] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}