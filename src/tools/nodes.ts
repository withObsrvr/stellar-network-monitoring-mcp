import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { StellarNetworkApiClient } from '../api/client.js';
import { logger } from '../utils/logger.js';
import { Node, HealthCheck, NodeSnapshot } from '../types/index.js';

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

  getNodeSnapshotsTool(): Tool {
    return {
      name: 'get_node_snapshots',
      description: 'Retrieve historical snapshots for trend analysis',
      inputSchema: {
        type: 'object',
        properties: {
          publicKey: {
            type: 'string',
            description: 'The public key of the node to get snapshots for'
          },
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
          },
          limit: {
            type: 'number',
            description: 'Maximum number of snapshots to return (default: 100)'
          }
        },
        required: ['publicKey']
      }
    };
  }

  getPerformanceMetricsTool(): Tool {
    return {
      name: 'get_performance_metrics',
      description: 'Retrieve key performance indicators for nodes/network',
      inputSchema: {
        type: 'object',
        properties: {
          publicKey: {
            type: 'string',
            description: 'Node public key for specific node metrics (optional)'
          },
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
          },
          timeRange: {
            type: 'string',
            enum: ['1h', '24h', '7d', '30d'],
            description: 'Time range for metrics aggregation (default: 24h)'
          }
        }
      }
    };
  }

  compareNodesTool(): Tool {
    return {
      name: 'compare_nodes',
      description: 'Compare performance metrics between multiple nodes',
      inputSchema: {
        type: 'object',
        properties: {
          publicKeys: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of node public keys to compare'
          },
          metrics: {
            type: 'array',
            items: { 
              type: 'string',
              enum: ['uptime', 'performance', 'connectivity', 'version', 'geography']
            },
            description: 'Metrics to compare (default: all)'
          },
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
          }
        },
        required: ['publicKeys']
      }
    };
  }

  rankValidatorsTool(): Tool {
    return {
      name: 'rank_validators',
      description: 'Rank validators by performance, reliability, or other criteria',
      inputSchema: {
        type: 'object',
        properties: {
          sortBy: {
            type: 'string',
            enum: ['uptime', 'performance', 'reliability', 'stake', 'age'],
            description: 'Criteria to rank validators by (default: reliability)'
          },
          limit: {
            type: 'number',
            description: 'Maximum number of validators to return (default: 50)'
          },
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
          },
          activeOnly: {
            type: 'boolean',
            description: 'Filter to only active validators (default: true)'
          }
        }
      }
    };
  }

  searchNodesTool(): Tool {
    return {
      name: 'search_nodes',
      description: 'Search nodes by various criteria (location, version, organization)',
      inputSchema: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'Filter by geographic location (country, city, region)'
          },
          version: {
            type: 'string',
            description: 'Filter by Stellar Core version'
          },
          organizationId: {
            type: 'string',
            description: 'Filter by organization ID'
          },
          active: {
            type: 'boolean',
            description: 'Filter by active status'
          },
          validating: {
            type: 'boolean',
            description: 'Filter by validator status'
          },
          overLoaded: {
            type: 'boolean',
            description: 'Filter by overloaded status'
          },
          minUptime: {
            type: 'number',
            description: 'Minimum uptime percentage (0-100)'
          },
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
          }
        }
      }
    };
  }

  findNodesByLocationTool(): Tool {
    return {
      name: 'find_nodes_by_location',
      description: 'Get nodes in specific geographic regions',
      inputSchema: {
        type: 'object',
        properties: {
          country: {
            type: 'string',
            description: 'Country name or code'
          },
          region: {
            type: 'string',
            description: 'Geographic region (continent, area)'
          },
          city: {
            type: 'string',
            description: 'City name'
          },
          activeOnly: {
            type: 'boolean',
            description: 'Filter to only active nodes (default: false)'
          },
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
          }
        }
      }
    };
  }

  getNodesByVersionTool(): Tool {
    return {
      name: 'get_nodes_by_version',
      description: 'Filter nodes by Stellar Core version',
      inputSchema: {
        type: 'object',
        properties: {
          version: {
            type: 'string',
            description: 'Stellar Core version (e.g., "19.5.0", "19.*")'
          },
          comparison: {
            type: 'string',
            enum: ['exact', 'major', 'minor', 'greater', 'less'],
            description: 'Version comparison type (default: exact)'
          },
          activeOnly: {
            type: 'boolean',
            description: 'Filter to only active nodes (default: false)'
          },
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
          }
        },
        required: ['version']
      }
    };
  }

  findPeerConnectionsTool(): Tool {
    return {
      name: 'find_peer_connections',
      description: 'Analyze node connectivity and peer relationships',
      inputSchema: {
        type: 'object',
        properties: {
          publicKey: {
            type: 'string',
            description: 'Node public key to analyze connections for (optional)'
          },
          organizationId: {
            type: 'string',
            description: 'Organization ID to analyze connections for (optional)'
          },
          includeInactive: {
            type: 'boolean',
            description: 'Include inactive nodes in analysis (default: false)'
          },
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
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

  async handleGetNodeSnapshots(args: { publicKey: string; at?: string; limit?: number }): Promise<any> {
    try {
      logger.info('Fetching node snapshots', { publicKey: args.publicKey, at: args.at, limit: args.limit });
      
      const response = await this.client.getNodeSnapshots(args.publicKey, args.at);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch node snapshots');
      }

      let snapshots = response.data;
      
      if (args.limit && args.limit > 0) {
        snapshots = snapshots.slice(0, args.limit);
      }

      const trends = this.analyzeSnapshotTrends(snapshots);

      return {
        snapshots: snapshots.map(snapshot => ({
          timestamp: snapshot.dateCreated,
          active: snapshot.active,
          uptime: snapshot.uptime,
          stellarCoreVersion: snapshot.stellarCoreVersion,
          overLoaded: snapshot.overLoaded,
          validating: snapshot.validating
        })),
        trends,
        summary: {
          total: snapshots.length,
          timespan: snapshots.length > 0 ? {
            start: snapshots[snapshots.length - 1]?.dateCreated,
            end: snapshots[0]?.dateCreated
          } : null,
          averageUptime: trends.averageUptime,
          downtimeEvents: trends.downtimeEvents
        }
      };
    } catch (error) {
      logger.error('Error fetching node snapshots', { error: error instanceof Error ? error.message : String(error), publicKey: args.publicKey });
      throw new Error(`Failed to get node snapshots: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleGetPerformanceMetrics(args: { publicKey?: string; at?: string; timeRange?: string }): Promise<any> {
    try {
      logger.info('Fetching performance metrics', { publicKey: args.publicKey, at: args.at, timeRange: args.timeRange });
      
      if (args.publicKey) {
        const nodeResponse = await this.client.getNodeByPublicKey(args.publicKey, args.at);
        const snapshotsResponse = await this.client.getNodeSnapshots(args.publicKey, args.at);
        
        if (!nodeResponse.success || !snapshotsResponse.success) {
          throw new Error('Failed to fetch node data for metrics');
        }

        const node = nodeResponse.data;
        const snapshots = snapshotsResponse.data;

        return {
          nodeMetrics: {
            publicKey: node.publicKey,
            name: node.name,
            currentUptime: node.uptime,
            performance: this.calculatePerformanceScore(node, snapshots),
            connectivity: {
              active: node.active,
              overLoaded: node.overLoaded,
              lastSeen: node.lastSeen
            },
            version: node.stellarCoreVersion,
            geography: node.geography
          },
          historicalTrends: this.analyzeSnapshotTrends(snapshots),
          benchmarks: await this.getNetworkBenchmarks(args.at)
        };
      } else {
        const networkResponse = await this.client.getNetworkData(args.at);
        
        if (!networkResponse.success) {
          throw new Error('Failed to fetch network data for metrics');
        }

        return {
          networkMetrics: {
            totalNodes: networkResponse.data.nodes?.length || 0,
            activeNodes: networkResponse.data.nodes?.filter((n: any) => n.active).length || 0,
            validators: networkResponse.data.nodes?.filter((n: any) => n.validating).length || 0,
            averageUptime: this.calculateAverageUptime(networkResponse.data.nodes || []),
            networkHealth: this.calculateNetworkHealth(networkResponse.data)
          },
          consensusMetrics: {
            failingNodes: networkResponse.data.nodes?.filter((n: any) => !n.active).length || 0
          }
        };
      }
    } catch (error) {
      logger.error('Error fetching performance metrics', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to get performance metrics: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleCompareNodes(args: { publicKeys: string[]; metrics?: string[]; at?: string }): Promise<any> {
    try {
      logger.info('Comparing nodes', { publicKeys: args.publicKeys, metrics: args.metrics, at: args.at });
      
      if (args.publicKeys.length < 2) {
        throw new Error('At least 2 nodes are required for comparison');
      }

      const nodeComparisons = [];
      const defaultMetrics = ['uptime', 'performance', 'connectivity', 'version', 'geography'];
      const metricsToCompare = args.metrics || defaultMetrics;

      for (const publicKey of args.publicKeys) {
        const nodeResponse = await this.client.getNodeByPublicKey(publicKey, args.at);
        const snapshotsResponse = await this.client.getNodeSnapshots(publicKey, args.at);
        
        if (!nodeResponse.success) {
          nodeComparisons.push({
            publicKey,
            error: 'Node not found or unavailable'
          });
          continue;
        }

        const node = nodeResponse.data;
        const snapshots = snapshotsResponse.success ? snapshotsResponse.data : [];

        const comparison: any = {
          publicKey: node.publicKey,
          name: node.name,
          organizationId: node.organizationId
        };

        if (metricsToCompare.includes('uptime')) {
          comparison.uptime = {
            current: node.uptime,
            trend: this.calculateUptimeTrend(snapshots)
          };
        }

        if (metricsToCompare.includes('performance')) {
          comparison.performance = this.calculatePerformanceScore(node, snapshots);
        }

        if (metricsToCompare.includes('connectivity')) {
          comparison.connectivity = {
            active: node.active,
            overLoaded: node.overLoaded,
            lastSeen: node.lastSeen
          };
        }

        if (metricsToCompare.includes('version')) {
          comparison.version = node.stellarCoreVersion;
        }

        if (metricsToCompare.includes('geography')) {
          comparison.geography = node.geography;
        }

        nodeComparisons.push(comparison);
      }

      return {
        comparison: nodeComparisons,
        summary: this.generateComparisonSummary(nodeComparisons, metricsToCompare),
        recommendations: this.generateComparisonRecommendations(nodeComparisons)
      };
    } catch (error) {
      logger.error('Error comparing nodes', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to compare nodes: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleRankValidators(args: { sortBy?: string; limit?: number; at?: string; activeOnly?: boolean }): Promise<any> {
    try {
      logger.info('Ranking validators', { sortBy: args.sortBy, limit: args.limit, at: args.at, activeOnly: args.activeOnly });
      
      const response = await this.client.getAllNodes(args.at);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch nodes for ranking');
      }

      let validators = response.data.filter(node => node.validating);
      
      if (args.activeOnly !== false) {
        validators = validators.filter(node => node.active);
      }

      const sortBy = args.sortBy || 'reliability';
      const limit = args.limit || 50;

      const rankedValidators = [];

      for (const validator of validators) {
        const snapshotsResponse = await this.client.getNodeSnapshots(validator.publicKey, args.at);
        const snapshots = snapshotsResponse.success ? snapshotsResponse.data : [];

        const ranking: any = {
          rank: 0,
          publicKey: validator.publicKey,
          name: validator.name,
          organizationId: validator.organizationId,
          geography: validator.geography,
          active: validator.active,
          uptime: validator.uptime,
          stellarCoreVersion: validator.stellarCoreVersion
        };

        switch (sortBy) {
          case 'uptime':
            ranking.score = validator.uptime || 0;
            break;
          case 'performance':
            ranking.score = this.calculatePerformanceScore(validator, snapshots);
            break;
          case 'reliability':
            ranking.score = this.calculateReliabilityScore(validator, snapshots);
            break;
          case 'age':
            ranking.score = this.calculateNodeAge(snapshots);
            break;
          default:
            ranking.score = this.calculateReliabilityScore(validator, snapshots);
        }

        rankedValidators.push(ranking);
      }

      rankedValidators.sort((a, b) => b.score - a.score);
      rankedValidators.forEach((validator, index) => {
        validator.rank = index + 1;
      });

      const topValidators = rankedValidators.slice(0, limit);

      return {
        validators: topValidators,
        ranking: {
          criteria: sortBy,
          total: rankedValidators.length,
          shown: topValidators.length
        },
        statistics: {
          averageScore: rankedValidators.reduce((sum, v) => sum + v.score, 0) / rankedValidators.length,
          topScore: rankedValidators[0]?.score || 0,
          distributionByOrganization: this.groupValidatorsByOrganization(topValidators)
        }
      };
    } catch (error) {
      logger.error('Error ranking validators', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to rank validators: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private analyzeSnapshotTrends(snapshots: NodeSnapshot[]): any {
    if (snapshots.length === 0) {
      return { averageUptime: 0, downtimeEvents: 0, trend: 'no_data' };
    }

    const uptimes = snapshots.map(s => s.uptime || 0).filter(u => u > 0);
    const averageUptime = uptimes.length > 0 ? uptimes.reduce((sum, u) => sum + u, 0) / uptimes.length : 0;

    let downtimeEvents = 0;
    for (let i = 1; i < snapshots.length; i++) {
      if (snapshots[i-1].active && !snapshots[i].active) {
        downtimeEvents++;
      }
    }

    const trend = this.calculateUptimeTrend(snapshots);

    return {
      averageUptime: Math.round(averageUptime * 100) / 100,
      downtimeEvents,
      trend
    };
  }

  private calculateUptimeTrend(snapshots: NodeSnapshot[]): string {
    if (snapshots.length < 2) return 'insufficient_data';

    const recentSnapshots = snapshots.slice(0, Math.min(10, snapshots.length));
    const olderSnapshots = snapshots.slice(-Math.min(10, snapshots.length));

    const recentAvg = recentSnapshots.reduce((sum, s) => sum + (s.uptime || 0), 0) / recentSnapshots.length;
    const olderAvg = olderSnapshots.reduce((sum, s) => sum + (s.uptime || 0), 0) / olderSnapshots.length;

    const difference = recentAvg - olderAvg;

    if (difference > 2) return 'improving';
    if (difference < -2) return 'declining';
    return 'stable';
  }

  private calculatePerformanceScore(node: Node, snapshots: NodeSnapshot[]): number {
    let score = 0;

    if (node.active) score += 30;
    if (!node.overLoaded) score += 20;
    if (node.uptime) score += Math.min(30, node.uptime * 0.3);

    const stabilityScore = this.calculateStabilityScore(snapshots);
    score += stabilityScore * 20;

    return Math.round(score);
  }

  private calculateReliabilityScore(node: Node, snapshots: NodeSnapshot[]): number {
    let score = 0;

    if (node.uptime) score += node.uptime * 0.4;
    if (node.active) score += 20;
    if (!node.overLoaded) score += 10;

    const trends = this.analyzeSnapshotTrends(snapshots);
    if (trends.trend === 'improving') score += 10;
    else if (trends.trend === 'declining') score -= 10;

    score -= trends.downtimeEvents * 5;

    return Math.max(0, Math.round(score));
  }

  private calculateStabilityScore(snapshots: NodeSnapshot[]): number {
    if (snapshots.length < 2) return 0.5;

    let stabilityEvents = 0;
    for (let i = 1; i < snapshots.length; i++) {
      if (snapshots[i-1].active !== snapshots[i].active) {
        stabilityEvents++;
      }
    }

    const stabilityRatio = 1 - (stabilityEvents / snapshots.length);
    return Math.max(0, Math.min(1, stabilityRatio));
  }

  private calculateNodeAge(snapshots: NodeSnapshot[]): number {
    if (snapshots.length === 0) return 0;
    
    const oldestSnapshot = snapshots[snapshots.length - 1];
    const newestSnapshot = snapshots[0];
    
    if (!oldestSnapshot.dateCreated || !newestSnapshot.dateCreated) return 0;
    
    const ageInDays = (new Date(newestSnapshot.dateCreated).getTime() - new Date(oldestSnapshot.dateCreated).getTime()) / (1000 * 60 * 60 * 24);
    return Math.round(ageInDays);
  }

  private async getNetworkBenchmarks(at?: string): Promise<any> {
    try {
      const response = await this.client.getNetworkData(at);
      
      if (!response.success) {
        return { error: 'Failed to fetch network benchmarks' };
      }

      const nodes = response.data.nodes || [];
      const activeNodes = nodes.filter(n => n.active);
      
      return {
        averageUptime: this.calculateAverageUptime(activeNodes),
        medianUptime: this.calculateMedianUptime(activeNodes),
        networkStability: activeNodes.length / nodes.length
      };
    } catch (error) {
      return { error: 'Failed to calculate benchmarks' };
    }
  }

  private calculateAverageUptime(nodes: Node[]): number {
    if (nodes.length === 0) return 0;
    const uptimes = nodes.map(n => n.uptime || 0).filter(u => u > 0);
    return uptimes.length > 0 ? uptimes.reduce((sum, u) => sum + u, 0) / uptimes.length : 0;
  }

  private calculateMedianUptime(nodes: Node[]): number {
    const uptimes = nodes.map(n => n.uptime || 0).filter(u => u > 0).sort((a, b) => a - b);
    if (uptimes.length === 0) return 0;
    
    const mid = Math.floor(uptimes.length / 2);
    return uptimes.length % 2 === 0 ? (uptimes[mid - 1] + uptimes[mid]) / 2 : uptimes[mid];
  }

  private calculateNetworkHealth(networkData: any): number {
    const nodes = networkData.nodes || [];
    const activeNodes = nodes.filter((n: any) => n.active);
    const validators = nodes.filter((n: any) => n.validating);
    const activeValidators = validators.filter((v: any) => v.active);

    let health = 0;
    
    health += (activeNodes.length / nodes.length) * 40;
    health += (activeValidators.length / validators.length) * 40;
    
    // Note: quorumIntersection not available in current API response
    // if (networkData.quorumIntersection) {
    //   health += 20;
    // }

    return Math.round(health);
  }

  private generateComparisonSummary(comparisons: any[], metrics: string[]): any {
    const summary: any = {
      totalNodes: comparisons.length,
      validNodes: comparisons.filter(c => !c.error).length
    };

    if (metrics.includes('uptime')) {
      const uptimes = comparisons.filter(c => c.uptime).map(c => c.uptime.current).filter(u => u !== undefined);
      if (uptimes.length > 0) {
        summary.uptimeStats = {
          highest: Math.max(...uptimes),
          lowest: Math.min(...uptimes),
          average: uptimes.reduce((sum, u) => sum + u, 0) / uptimes.length
        };
      }
    }

    if (metrics.includes('performance')) {
      const performances = comparisons.filter(c => c.performance !== undefined).map(c => c.performance);
      if (performances.length > 0) {
        summary.performanceStats = {
          highest: Math.max(...performances),
          lowest: Math.min(...performances),
          average: performances.reduce((sum, p) => sum + p, 0) / performances.length
        };
      }
    }

    return summary;
  }

  private generateComparisonRecommendations(comparisons: any[]): string[] {
    const recommendations: string[] = [];
    
    const validComparisons = comparisons.filter(c => !c.error);
    
    if (validComparisons.length === 0) {
      recommendations.push('No valid nodes found for comparison');
      return recommendations;
    }

    const inactiveNodes = validComparisons.filter(c => c.connectivity && !c.connectivity.active);
    if (inactiveNodes.length > 0) {
      recommendations.push(`${inactiveNodes.length} node(s) are currently inactive and need attention`);
    }

    const lowUptimeNodes = validComparisons.filter(c => c.uptime && c.uptime.current < 95);
    if (lowUptimeNodes.length > 0) {
      recommendations.push(`${lowUptimeNodes.length} node(s) have uptime below 95% and should be investigated`);
    }

    const overloadedNodes = validComparisons.filter(c => c.connectivity && c.connectivity.overLoaded);
    if (overloadedNodes.length > 0) {
      recommendations.push(`${overloadedNodes.length} node(s) are overloaded and may need resource scaling`);
    }

    if (recommendations.length === 0) {
      recommendations.push('All nodes appear to be performing well');
    }

    return recommendations;
  }

  async handleSearchNodes(args: { 
    location?: string; 
    version?: string; 
    organizationId?: string; 
    active?: boolean; 
    validating?: boolean; 
    overLoaded?: boolean; 
    minUptime?: number; 
    at?: string 
  }): Promise<any> {
    try {
      logger.info('Searching nodes', { args });
      
      const response = await this.client.getAllNodes(args.at);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch nodes');
      }

      let filteredNodes = response.data;

      // Apply filters
      if (args.location) {
        const locationFilter = args.location.toLowerCase();
        filteredNodes = filteredNodes.filter(node => 
          node.geography && (
            node.geography.countryName?.toLowerCase().includes(locationFilter) ||
            node.geography.countryCode?.toLowerCase().includes(locationFilter)
          )
        );
      }

      if (args.version) {
        filteredNodes = filteredNodes.filter(node => 
          node.stellarCoreVersion === args.version
        );
      }

      if (args.organizationId) {
        filteredNodes = filteredNodes.filter(node => 
          node.organizationId === args.organizationId
        );
      }

      if (args.active !== undefined) {
        filteredNodes = filteredNodes.filter(node => node.active === args.active);
      }

      if (args.validating !== undefined) {
        filteredNodes = filteredNodes.filter(node => node.validating === args.validating);
      }

      if (args.overLoaded !== undefined) {
        filteredNodes = filteredNodes.filter(node => node.overLoaded === args.overLoaded);
      }

      if (args.minUptime !== undefined) {
        filteredNodes = filteredNodes.filter(node => 
          node.uptime !== undefined && node.uptime >= args.minUptime!
        );
      }

      return {
        nodes: filteredNodes.map(node => ({
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
        filters: args,
        summary: {
          total: filteredNodes.length,
          active: filteredNodes.filter(n => n.active).length,
          validators: filteredNodes.filter(n => n.validating).length,
          overloaded: filteredNodes.filter(n => n.overLoaded).length
        }
      };
    } catch (error) {
      logger.error('Error searching nodes', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to search nodes: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleFindNodesByLocation(args: { 
    country?: string; 
    region?: string; 
    city?: string; 
    activeOnly?: boolean; 
    at?: string 
  }): Promise<any> {
    try {
      logger.info('Finding nodes by location', { args });
      
      const response = await this.client.getAllNodes(args.at);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch nodes');
      }

      let filteredNodes = response.data;

      // Filter by location criteria
      if (args.country) {
        const countryFilter = args.country.toLowerCase();
        filteredNodes = filteredNodes.filter(node => 
          node.geography?.countryName?.toLowerCase().includes(countryFilter) ||
          node.geography?.countryCode?.toLowerCase().includes(countryFilter)
        );
      }

      if (args.region) {
        const regionFilter = args.region.toLowerCase();
        filteredNodes = filteredNodes.filter(node => 
          node.geography?.countryName?.toLowerCase().includes(regionFilter)
        );
      }

      if (args.city) {
        const cityFilter = args.city.toLowerCase();
        // Note: Geography interface doesn't have city field in current API
        // This filter will not match anything with current geography structure
        filteredNodes = filteredNodes.filter(node => false);
      }

      if (args.activeOnly) {
        filteredNodes = filteredNodes.filter(node => node.active);
      }

      // Group by location for summary
      const locationGroups = this.groupNodesByLocation(filteredNodes);

      return {
        nodes: filteredNodes.map(node => ({
          publicKey: node.publicKey,
          name: node.name,
          host: node.host,
          active: node.active,
          validating: node.validating,
          organizationId: node.organizationId,
          geography: node.geography,
          uptime: node.uptime
        })),
        locationDistribution: locationGroups,
        summary: {
          total: filteredNodes.length,
          active: filteredNodes.filter(n => n.active).length,
          validators: filteredNodes.filter(n => n.validating).length,
          countries: Object.keys(locationGroups.byCountry).length,
          cities: Object.keys(locationGroups.byCity).length
        }
      };
    } catch (error) {
      logger.error('Error finding nodes by location', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to find nodes by location: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleGetNodesByVersion(args: { 
    version: string; 
    comparison?: string; 
    activeOnly?: boolean; 
    at?: string 
  }): Promise<any> {
    try {
      logger.info('Getting nodes by version', { args });
      
      const response = await this.client.getAllNodes(args.at);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch nodes');
      }

      let filteredNodes = response.data;
      const comparison = args.comparison || 'exact';

      // Filter by version criteria
      filteredNodes = filteredNodes.filter(node => {
        if (!node.stellarCoreVersion) return false;
        
        return this.matchVersion(node.stellarCoreVersion, args.version, comparison);
      });

      if (args.activeOnly) {
        filteredNodes = filteredNodes.filter(node => node.active);
      }

      // Group by version for analysis
      const versionGroups = this.groupNodesByVersion(filteredNodes);

      return {
        nodes: filteredNodes.map(node => ({
          publicKey: node.publicKey,
          name: node.name,
          host: node.host,
          active: node.active,
          validating: node.validating,
          stellarCoreVersion: node.stellarCoreVersion,
          organizationId: node.organizationId,
          geography: node.geography,
          uptime: node.uptime
        })),
        versionAnalysis: {
          targetVersion: args.version,
          comparison: comparison,
          versionDistribution: versionGroups
        },
        summary: {
          total: filteredNodes.length,
          active: filteredNodes.filter(n => n.active).length,
          validators: filteredNodes.filter(n => n.validating).length,
          uniqueVersions: Object.keys(versionGroups).length
        }
      };
    } catch (error) {
      logger.error('Error getting nodes by version', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to get nodes by version: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleFindPeerConnections(args: { 
    publicKey?: string; 
    organizationId?: string; 
    includeInactive?: boolean; 
    at?: string 
  }): Promise<any> {
    try {
      logger.info('Finding peer connections', { args });
      
      const response = await this.client.getAllNodes(args.at);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch nodes');
      }

      let nodes = response.data;
      
      if (!args.includeInactive) {
        nodes = nodes.filter(node => node.active);
      }

      let connectivityAnalysis: any = {};

      if (args.publicKey) {
        // Analyze connections for specific node
        const targetNode = nodes.find(n => n.publicKey === args.publicKey);
        if (!targetNode) {
          throw new Error('Node not found');
        }

        connectivityAnalysis = await this.analyzeNodeConnectivity(targetNode, nodes);
      } else if (args.organizationId) {
        // Analyze connections for organization
        const orgNodes = nodes.filter(n => n.organizationId === args.organizationId);
        connectivityAnalysis = await this.analyzeOrganizationConnectivity(orgNodes, nodes);
      } else {
        // Network-wide connectivity analysis
        connectivityAnalysis = await this.analyzeNetworkConnectivity(nodes);
      }

      return {
        connectivityAnalysis,
        networkTopology: this.buildNetworkTopology(nodes),
        summary: {
          totalNodes: nodes.length,
          activeNodes: nodes.filter(n => n.active).length,
          validators: nodes.filter(n => n.validating).length,
          organizations: [...new Set(nodes.map(n => n.organizationId).filter(Boolean))].length
        }
      };
    } catch (error) {
      logger.error('Error finding peer connections', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to find peer connections: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private groupNodesByLocation(nodes: Node[]): any {
    const byCountry: Record<string, number> = {};
    const byCity: Record<string, number> = {};
    const byRegion: Record<string, number> = {};

    nodes.forEach(node => {
      if (node.geography) {
        if (node.geography.countryName) {
          byCountry[node.geography.countryName] = (byCountry[node.geography.countryName] || 0) + 1;
        }
        // Note: Geography interface doesn't have city or region fields in current API
        // These will remain empty with current geography structure
      }
    });

    return { byCountry, byCity, byRegion };
  }

  private groupNodesByVersion(nodes: Node[]): Record<string, number> {
    return nodes.reduce((acc, node) => {
      const version = node.stellarCoreVersion || 'Unknown';
      acc[version] = (acc[version] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private matchVersion(nodeVersion: string, targetVersion: string, comparison: string): boolean {
    if (comparison === 'exact') {
      return nodeVersion === targetVersion;
    }

    const parsedNodeVersion = this.parseVersion(nodeVersion);
    const parsedTargetVersion = this.parseVersion(targetVersion);

    if (!parsedNodeVersion || !parsedTargetVersion) return false;

    switch (comparison) {
      case 'major':
        return parsedNodeVersion.major === parsedTargetVersion.major;
      case 'minor':
        return parsedNodeVersion.major === parsedTargetVersion.major && 
               parsedNodeVersion.minor === parsedTargetVersion.minor;
      case 'greater':
        return this.compareVersions(parsedNodeVersion, parsedTargetVersion) > 0;
      case 'less':
        return this.compareVersions(parsedNodeVersion, parsedTargetVersion) < 0;
      default:
        return nodeVersion === targetVersion;
    }
  }

  private parseVersion(version: string): { major: number; minor: number; patch: number } | null {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
    if (!match) return null;
    
    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3], 10)
    };
  }

  private compareVersions(v1: any, v2: any): number {
    if (v1.major !== v2.major) return v1.major - v2.major;
    if (v1.minor !== v2.minor) return v1.minor - v2.minor;
    return v1.patch - v2.patch;
  }

  private async analyzeNodeConnectivity(targetNode: Node, allNodes: Node[]): Promise<any> {
    // Analyze connectivity for a specific node
    const sameOrgNodes = allNodes.filter(n => 
      n.organizationId === targetNode.organizationId && n.publicKey !== targetNode.publicKey
    );
    
    const sameLocationNodes = allNodes.filter(n => 
      n.geography?.countryName === targetNode.geography?.countryName && 
      n.publicKey !== targetNode.publicKey
    );

    const sameVersionNodes = allNodes.filter(n => 
      n.stellarCoreVersion === targetNode.stellarCoreVersion && 
      n.publicKey !== targetNode.publicKey
    );

    return {
      node: {
        publicKey: targetNode.publicKey,
        name: targetNode.name,
        organizationId: targetNode.organizationId,
        geography: targetNode.geography
      },
      potentialPeers: {
        sameOrganization: sameOrgNodes.length,
        sameLocation: sameLocationNodes.length,
        sameVersion: sameVersionNodes.length
      },
      connectivity: {
        diversity: {
          organizations: [...new Set(allNodes.map(n => n.organizationId))].length,
          locations: [...new Set(allNodes.map(n => n.geography?.countryName))].length,
          versions: [...new Set(allNodes.map(n => n.stellarCoreVersion))].length
        }
      }
    };
  }

  private async analyzeOrganizationConnectivity(orgNodes: Node[], allNodes: Node[]): Promise<any> {
    const otherOrgNodes = allNodes.filter(n => 
      n.organizationId !== orgNodes[0]?.organizationId
    );

    return {
      organization: orgNodes[0]?.organizationId,
      internalNodes: orgNodes.length,
      externalNodes: otherOrgNodes.length,
      connectivity: {
        internalConnections: this.calculateInternalConnections(orgNodes),
        externalConnections: this.calculateExternalConnections(orgNodes, otherOrgNodes)
      }
    };
  }

  private async analyzeNetworkConnectivity(nodes: Node[]): Promise<any> {
    const organizationGroups = this.groupValidatorsByOrganization(nodes);
    const versionGroups = this.groupNodesByVersion(nodes);
    const locationGroups = this.groupNodesByLocation(nodes);

    return {
      networkwide: {
        totalNodes: nodes.length,
        organizations: Object.keys(organizationGroups).length,
        versions: Object.keys(versionGroups).length,
        countries: Object.keys(locationGroups.byCountry).length
      },
      distribution: {
        byOrganization: organizationGroups,
        byVersion: versionGroups,
        byLocation: locationGroups.byCountry
      },
      redundancy: {
        organizationalDiversity: this.calculateOrganizationalDiversity(organizationGroups),
        geographicDiversity: this.calculateGeographicDiversity(locationGroups.byCountry),
        versionDiversity: this.calculateVersionDiversity(versionGroups)
      }
    };
  }

  private buildNetworkTopology(nodes: Node[]): any {
    const topology = {
      nodes: nodes.length,
      clusters: {
        byOrganization: {},
        byLocation: {},
        byVersion: {}
      }
    };

    // This is a simplified topology analysis
    // In a real implementation, this would analyze actual peer connections
    return topology;
  }

  private calculateInternalConnections(nodes: Node[]): any {
    return {
      possibleConnections: nodes.length * (nodes.length - 1),
      activeNodes: nodes.filter(n => n.active).length
    };
  }

  private calculateExternalConnections(orgNodes: Node[], externalNodes: Node[]): any {
    return {
      possibleConnections: orgNodes.length * externalNodes.length,
      activeExternalNodes: externalNodes.filter(n => n.active).length
    };
  }

  private calculateOrganizationalDiversity(orgGroups: Record<string, number>): number {
    const total = Object.values(orgGroups).reduce((sum, count) => sum + count, 0);
    const entropy = Object.values(orgGroups).reduce((entropy, count) => {
      const p = count / total;
      return entropy - (p * Math.log2(p));
    }, 0);
    return Math.round(entropy * 100) / 100;
  }

  private calculateGeographicDiversity(locationGroups: Record<string, number>): number {
    return Object.keys(locationGroups).length;
  }

  private calculateVersionDiversity(versionGroups: Record<string, number>): number {
    return Object.keys(versionGroups).length;
  }
}