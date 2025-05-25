import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { StellarNetworkApiClient } from '../api/client.js';
import { logger } from '../utils/logger.js';
import { Organization, Node, OrganizationSnapshot } from '../types/index.js';

export class OrganizationTools {
  constructor(private client: StellarNetworkApiClient) {}

  getAllOrganizationsTool(): Tool {
    return {
      name: 'get_all_organizations',
      description: 'List all organizations with basic info and node counts',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    };
  }

  getOrganizationDetailsTool(): Tool {
    return {
      name: 'get_organization_details',
      description: 'Get detailed organization info including contacts',
      inputSchema: {
        type: 'object',
        properties: {
          organizationId: {
            type: 'string',
            description: 'The ID of the organization to get details for'
          },
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
          }
        },
        required: ['organizationId']
      }
    };
  }

  analyzeOrganizationReliabilityTool(): Tool {
    return {
      name: 'analyze_organization_reliability',
      description: 'Assess organization node reliability and performance',
      inputSchema: {
        type: 'object',
        properties: {
          organizationId: {
            type: 'string',
            description: 'The ID of the organization to analyze'
          }
        },
        required: ['organizationId']
      }
    };
  }

  getOrganizationNodesTool(): Tool {
    return {
      name: 'get_organization_nodes',
      description: 'List nodes operated by a specific organization',
      inputSchema: {
        type: 'object',
        properties: {
          organizationId: {
            type: 'string',
            description: 'The ID of the organization to get nodes for'
          },
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
          },
          activeOnly: {
            type: 'boolean',
            description: 'Filter to only return active nodes (default: false)'
          }
        },
        required: ['organizationId']
      }
    };
  }

  getOrganizationSnapshotsTool(): Tool {
    return {
      name: 'get_organization_snapshots',
      description: 'Get historical organization data',
      inputSchema: {
        type: 'object',
        properties: {
          organizationId: {
            type: 'string',
            description: 'The ID of the organization to get snapshots for'
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
        required: ['organizationId']
      }
    };
  }

  async handleGetAllOrganizations(): Promise<any> {
    try {
      logger.info('Fetching all organizations');
      
      const response = await this.client.getAllOrganizations();
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch organizations');
      }

      const organizations = response.data;

      return {
        organizations: organizations.map(org => ({
          id: org.id,
          name: org.name,
          description: org.description,
          website: org.url,
          keybase: org.keybase,
          twitter: org.twitter,
          github: org.github,
          totalNodes: org.validators?.length || 0,
          validators: org.validators?.length || 0,
          physicalAddress: org.physicalAddress,
          officialEmail: org.officialEmail,
          phoneNumber: org.phoneNumber,
          homeDomain: org.homeDomain
        })),
        summary: {
          total: organizations.length,
          totalNodes: organizations.reduce((sum, org) => sum + (org.validators?.length || 0), 0),
          totalValidators: organizations.reduce((sum, org) => sum + (org.validators?.length || 0), 0)
        }
      };
    } catch (error) {
      logger.error('Error fetching all organizations', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to get all organizations: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleGetOrganizationDetails(args: { organizationId: string; at?: string }): Promise<Organization> {
    try {
      logger.info('Fetching organization details', { organizationId: args.organizationId, at: args.at });
      
      const response = await this.client.getOrganizationById(args.organizationId, args.at);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch organization details');
      }

      return response.data;
    } catch (error) {
      logger.error('Error fetching organization details', { 
        error: error instanceof Error ? error.message : String(error), 
        organizationId: args.organizationId 
      });
      throw new Error(`Failed to get organization details: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleAnalyzeOrganizationReliability(args: { organizationId: string }): Promise<any> {
    try {
      logger.info('Analyzing organization reliability', { organizationId: args.organizationId });
      
      const [orgResponse, nodesResponse] = await Promise.all([
        this.client.getOrganizationById(args.organizationId),
        this.client.getAllNodes()
      ]);
      
      if (!orgResponse.success) {
        throw new Error(orgResponse.error || 'Failed to fetch organization');
      }
      
      if (!nodesResponse.success) {
        throw new Error(nodesResponse.error || 'Failed to fetch nodes');
      }

      const organization = orgResponse.data;
      const allNodes = nodesResponse.data;
      const orgNodes = allNodes.filter(node => node.organizationId === args.organizationId);

      if (orgNodes.length === 0) {
        return {
          organizationId: args.organizationId,
          name: organization.name,
          reliability: {
            score: 0,
            grade: 'N/A',
            issues: ['No nodes found for this organization']
          },
          nodeStatistics: {
            total: 0,
            active: 0,
            validators: 0,
            overloaded: 0
          }
        };
      }

      const activeNodes = orgNodes.filter(node => node.active);
      const validators = orgNodes.filter(node => 
        (node.statistics?.validating24HoursPercentage || 0) > 0 || 
        (node.statistics?.validating30DaysPercentage || 0) > 0
      );
      const overloadedNodes = orgNodes.filter(node => node.overLoaded);
      const nodesWithUptime = orgNodes.filter(node => node.uptime !== undefined);
      
      const averageUptime = nodesWithUptime.length > 0 
        ? nodesWithUptime.reduce((sum, node) => sum + (node.uptime || 0), 0) / nodesWithUptime.length
        : 0;

      const reliability = this.calculateOrganizationReliability(orgNodes, activeNodes, validators, overloadedNodes, averageUptime);

      return {
        organizationId: args.organizationId,
        name: organization.name,
        reliability,
        nodeStatistics: {
          total: orgNodes.length,
          active: activeNodes.length,
          validators: validators.length,
          overloaded: overloadedNodes.length
        },
        performance: {
          averageUptime: Math.round(averageUptime * 100) / 100,
          uptimeGrade: this.getUptimeGrade(averageUptime),
          activeRatio: activeNodes.length / orgNodes.length,
          validatorRatio: validators.length / orgNodes.length
        }
      };
    } catch (error) {
      logger.error('Error analyzing organization reliability', { 
        error: error instanceof Error ? error.message : String(error), 
        organizationId: args.organizationId 
      });
      throw new Error(`Failed to analyze organization reliability: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleGetOrganizationNodes(args: { organizationId: string; at?: string; activeOnly?: boolean }): Promise<any> {
    try {
      logger.info('Fetching organization nodes', { 
        organizationId: args.organizationId, 
        at: args.at, 
        activeOnly: args.activeOnly 
      });
      
      const response = await this.client.getAllNodes(args.at);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch nodes');
      }

      let orgNodes = response.data.filter(node => node.organizationId === args.organizationId);
      
      if (args.activeOnly) {
        orgNodes = orgNodes.filter(node => node.active);
      }

      return {
        organizationId: args.organizationId,
        nodes: orgNodes.map(node => ({
          publicKey: node.publicKey,
          name: node.name,
          host: node.host,
          port: node.port,
          active: node.active,
          validating: node.isValidating || node.validating,
          overLoaded: node.overLoaded,
          stellarCoreVersion: node.stellarCoreVersion,
          geography: node.geography,
          uptime: node.uptime,
          statistics: node.statistics,
          lastSeen: node.lastSeen
        })),
        summary: {
          total: orgNodes.length,
          active: orgNodes.filter(n => n.active).length,
          validators: orgNodes.filter(n => 
            (n.statistics?.validating24HoursPercentage || 0) > 0 || 
            (n.statistics?.validating30DaysPercentage || 0) > 0
          ).length,
          overloaded: orgNodes.filter(n => n.overLoaded).length,
          byVersion: this.groupNodesByVersion(orgNodes),
          byCountry: this.groupNodesByCountry(orgNodes)
        }
      };
    } catch (error) {
      logger.error('Error fetching organization nodes', { 
        error: error instanceof Error ? error.message : String(error), 
        organizationId: args.organizationId 
      });
      throw new Error(`Failed to get organization nodes: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private calculateOrganizationReliability(
    allNodes: Node[], 
    activeNodes: Node[], 
    validators: Node[], 
    overloadedNodes: Node[], 
    averageUptime: number
  ): { score: number; grade: string; issues: string[] } {
    let score = 100;
    const issues: string[] = [];

    const activeRatio = activeNodes.length / allNodes.length;
    if (activeRatio < 0.9) {
      const penalty = (0.9 - activeRatio) * 50;
      score -= penalty;
      issues.push(`Low active node ratio: ${Math.round(activeRatio * 100)}%`);
    }

    if (averageUptime < 95) {
      const penalty = (95 - averageUptime) * 2;
      score -= penalty;
      issues.push(`Low average uptime: ${averageUptime.toFixed(1)}%`);
    }

    const overloadRatio = overloadedNodes.length / allNodes.length;
    if (overloadRatio > 0.1) {
      const penalty = overloadRatio * 30;
      score -= penalty;
      issues.push(`High overload ratio: ${Math.round(overloadRatio * 100)}%`);
    }

    if (validators.length > 0) {
      const validatorActiveRatio = validators.filter(v => v.active).length / validators.length;
      if (validatorActiveRatio < 0.95) {
        score -= 20;
        issues.push(`Validator downtime detected`);
      }
    }

    score = Math.max(0, Math.round(score));
    const grade = this.getReliabilityGrade(score);

    return { score, grade, issues };
  }

  private getReliabilityGrade(score: number): string {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private getUptimeGrade(uptime: number): string {
    if (uptime >= 99.9) return 'Excellent';
    if (uptime >= 99.5) return 'Very Good';
    if (uptime >= 99) return 'Good';
    if (uptime >= 95) return 'Fair';
    return 'Poor';
  }

  private groupNodesByVersion(nodes: Node[]): Record<string, number> {
    return nodes.reduce((acc, node) => {
      const version = node.stellarCoreVersion || 'Unknown';
      acc[version] = (acc[version] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupNodesByCountry(nodes: Node[]): Record<string, number> {
    return nodes.reduce((acc, node) => {
      const country = node.geography?.countryName || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  async handleGetOrganizationSnapshots(args: { organizationId: string; at?: string; limit?: number }): Promise<any> {
    try {
      logger.info('Fetching organization snapshots', { organizationId: args.organizationId, at: args.at, limit: args.limit });
      
      const response = await this.client.getOrganizationSnapshots(args.organizationId, args.at);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch organization snapshots');
      }

      let snapshots = response.data;
      
      if (args.limit && args.limit > 0) {
        snapshots = snapshots.slice(0, args.limit);
      }

      const trends = this.analyzeOrganizationTrends(snapshots);

      return {
        organizationId: args.organizationId,
        snapshots: snapshots.map(snapshot => ({
          timestamp: snapshot.dateCreated,
          validators: snapshot.validators,
          isTierOneOrganization: snapshot.isTierOneOrganization,
          subQuorumAvailable: snapshot.subQuorumAvailable,
          subQuorumThreshold: snapshot.subQuorumThreshold
        })),
        trends,
        summary: {
          total: snapshots.length,
          timespan: snapshots.length > 0 ? {
            start: snapshots[snapshots.length - 1]?.dateCreated,
            end: snapshots[0]?.dateCreated
          } : null,
          currentValidators: snapshots[0]?.validators?.length || 0,
          tierOneStatus: snapshots[0]?.isTierOneOrganization || false
        }
      };
    } catch (error) {
      logger.error('Error fetching organization snapshots', { 
        error: error instanceof Error ? error.message : String(error), 
        organizationId: args.organizationId 
      });
      throw new Error(`Failed to get organization snapshots: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private analyzeOrganizationTrends(snapshots: OrganizationSnapshot[]): any {
    if (snapshots.length === 0) {
      return { validatorTrend: 'no_data', tierOneHistory: [], statusChanges: 0 };
    }

    const validatorCounts = snapshots.map(s => s.validators?.length || 0);
    const tierOneHistory = snapshots.map(s => ({
      timestamp: s.dateCreated,
      isTierOne: s.isTierOneOrganization
    }));

    let statusChanges = 0;
    for (let i = 1; i < snapshots.length; i++) {
      if (snapshots[i-1].isTierOneOrganization !== snapshots[i].isTierOneOrganization) {
        statusChanges++;
      }
    }

    const validatorTrend = this.calculateValidatorTrend(validatorCounts);

    return {
      validatorTrend,
      tierOneHistory,
      statusChanges,
      averageValidators: validatorCounts.length > 0 ? validatorCounts.reduce((sum, count) => sum + count, 0) / validatorCounts.length : 0
    };
  }

  private calculateValidatorTrend(validatorCounts: number[]): string {
    if (validatorCounts.length < 2) return 'insufficient_data';

    const recentCounts = validatorCounts.slice(0, Math.min(5, validatorCounts.length));
    const olderCounts = validatorCounts.slice(-Math.min(5, validatorCounts.length));

    const recentAvg = recentCounts.reduce((sum, count) => sum + count, 0) / recentCounts.length;
    const olderAvg = olderCounts.reduce((sum, count) => sum + count, 0) / olderCounts.length;

    const difference = recentAvg - olderAvg;

    if (difference > 0.5) return 'growing';
    if (difference < -0.5) return 'shrinking';
    return 'stable';
  }
}