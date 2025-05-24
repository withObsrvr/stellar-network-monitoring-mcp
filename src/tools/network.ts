import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { StellarNetworkApiClient } from '../api/client.js';
import { logger } from '../utils/logger.js';
import { 
  NetworkStatistics, 
  NetworkConsensusInfo, 
  Node 
} from '../types/index.js';

export class NetworkTools {
  constructor(private client: StellarNetworkApiClient) {}

  getNetworkStatusTool(): Tool {
    return {
      name: 'get_network_status',
      description: 'Get overall network health, consensus status, and key metrics',
      inputSchema: {
        type: 'object',
        properties: {
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
          }
        }
      }
    };
  }

  getNetworkStatisticsTool(): Tool {
    return {
      name: 'get_network_statistics',
      description: 'Retrieve network-wide statistics and performance metrics',
      inputSchema: {
        type: 'object',
        properties: {
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
          }
        }
      }
    };
  }

  checkNetworkConsensusTool(): Tool {
    return {
      name: 'check_network_consensus',
      description: 'Analyze consensus state and identify potential issues',
      inputSchema: {
        type: 'object',
        properties: {
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
          }
        }
      }
    };
  }

  async handleGetNetworkStatus(args: { at?: string }): Promise<any> {
    try {
      logger.info('Fetching network status', { at: args.at });
      
      const response = await this.client.getNetworkInfo(args.at);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch network information');
      }

      const networkInfo = response.data;
      const activeNodes = networkInfo.nodes.filter(node => node.active).length;
      const validators = networkInfo.nodes.filter(node => node.validating).length;
      const overloadedNodes = networkInfo.nodes.filter(node => node.overLoaded).length;
      
      const healthScore = this.calculateNetworkHealthScore(networkInfo.nodes);
      const status = this.determineNetworkStatus(healthScore, overloadedNodes, activeNodes);

      return {
        status,
        healthScore,
        summary: {
          totalNodes: networkInfo.nodes.length,
          activeNodes,
          validators,
          overloadedNodes,
          organizations: networkInfo.organizations.length
        },
        consensus: {
          healthy: healthScore > 80,
          validatorsOnline: validators,
          potentialIssues: overloadedNodes > 0 ? [`${overloadedNodes} nodes are overloaded`] : []
        },
        lastUpdated: networkInfo.updatedAt
      };
    } catch (error) {
      logger.error('Error fetching network status', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to get network status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleGetNetworkStatistics(args: { at?: string }): Promise<NetworkStatistics> {
    try {
      logger.info('Fetching network statistics', { at: args.at });
      
      const response = await this.client.getNetworkInfo(args.at);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch network information');
      }

      const networkInfo = response.data;
      const nodes = networkInfo.nodes;
      
      const activeNodes = nodes.filter(node => node.active);
      const validators = nodes.filter(node => node.validating);
      const uptimes = nodes
        .filter(node => node.uptime !== undefined)
        .map(node => node.uptime!);
      
      const averageUptime = uptimes.length > 0 
        ? uptimes.reduce((sum, uptime) => sum + uptime, 0) / uptimes.length 
        : 0;

      const consensusHealth = this.calculateConsensusHealth(nodes);

      return {
        totalNodes: nodes.length,
        activeNodes: activeNodes.length,
        validators: validators.length,
        organizations: networkInfo.organizations.length,
        averageUptime,
        consensusHealth
      };
    } catch (error) {
      logger.error('Error fetching network statistics', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to get network statistics: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleCheckNetworkConsensus(args: { at?: string }): Promise<NetworkConsensusInfo> {
    try {
      logger.info('Checking network consensus', { at: args.at });
      
      const response = await this.client.getNetworkInfo(args.at);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch network information');
      }

      const nodes = response.data.nodes;
      const validators = nodes.filter(node => node.validating && node.active);
      const issues: string[] = [];
      
      if (validators.length < 3) {
        issues.push('Insufficient number of active validators for safe consensus');
      }
      
      const overloadedValidators = validators.filter(node => node.overLoaded);
      if (overloadedValidators.length > 0) {
        issues.push(`${overloadedValidators.length} validators are overloaded`);
      }
      
      const quorumIntersection = this.analyzeQuorumIntersection(validators);
      if (!quorumIntersection) {
        issues.push('Potential quorum intersection issues detected');
      }
      
      const safetyLevel = this.calculateSafetyLevel(validators, issues.length);

      return {
        healthy: issues.length === 0,
        issues,
        quorumIntersection,
        safetyLevel
      };
    } catch (error) {
      logger.error('Error checking network consensus', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to check network consensus: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private calculateNetworkHealthScore(nodes: Node[]): number {
    if (nodes.length === 0) return 0;
    
    const activeNodes = nodes.filter(node => node.active).length;
    const overloadedNodes = nodes.filter(node => node.overLoaded).length;
    const validators = nodes.filter(node => node.validating).length;
    
    const activeRatio = activeNodes / nodes.length;
    const overloadPenalty = (overloadedNodes / nodes.length) * 30;
    const validatorBonus = Math.min((validators / nodes.length) * 20, 20);
    
    return Math.max(0, Math.min(100, (activeRatio * 80) - overloadPenalty + validatorBonus));
  }

  private determineNetworkStatus(healthScore: number, overloadedNodes: number, activeNodes: number): string {
    if (healthScore >= 90 && overloadedNodes === 0) return 'excellent';
    if (healthScore >= 80 && overloadedNodes < activeNodes * 0.1) return 'good';
    if (healthScore >= 60 && overloadedNodes < activeNodes * 0.2) return 'fair';
    return 'poor';
  }

  private calculateConsensusHealth(nodes: Node[]): number {
    const validators = nodes.filter(node => node.validating && node.active);
    if (validators.length === 0) return 0;
    
    const overloadedValidators = validators.filter(node => node.overLoaded).length;
    const healthyValidators = validators.length - overloadedValidators;
    
    return Math.round((healthyValidators / validators.length) * 100);
  }

  private analyzeQuorumIntersection(validators: Node[]): boolean {
    if (validators.length < 4) return validators.length >= 3;
    
    const validatorsByOrg = validators.reduce((acc, validator) => {
      const org = validator.organizationId || 'unknown';
      acc[org] = (acc[org] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const organizations = Object.keys(validatorsByOrg);
    const maxValidatorsPerOrg = Math.max(...Object.values(validatorsByOrg));
    
    return maxValidatorsPerOrg < validators.length * 0.5 && organizations.length >= 3;
  }

  private calculateSafetyLevel(validators: Node[], issueCount: number): number {
    const baseScore = Math.min(validators.length * 10, 100);
    const penalty = issueCount * 15;
    return Math.max(0, baseScore - penalty);
  }
}