import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { StellarNetworkApiClient } from '../api/client.js';
import { NetworkTools } from './network.js';
import { NodeTools } from './nodes.js';
import { OrganizationTools } from './organizations.js';
import { logger } from '../utils/logger.js';

export class WorkflowTools {
  private networkTools: NetworkTools;
  private nodeTools: NodeTools;
  private organizationTools: OrganizationTools;

  constructor(private client: StellarNetworkApiClient) {
    this.networkTools = new NetworkTools(client);
    this.nodeTools = new NodeTools(client);
    this.organizationTools = new OrganizationTools(client);
  }

  investigateNetworkIssuesTool(): Tool {
    return {
      name: 'investigate_network_issues',
      description: `Complete network health investigation workflow.

Use this when a user asks about:
- "Is there a problem with the Stellar network?"
- "Why is the network having issues?"
- "What's wrong with Stellar today?"
- "Network health check"
- "Are there any network outages?"

This tool performs a comprehensive analysis by:
1. Checking overall network status and health
2. Detecting specific network issues and anomalies
3. Identifying failing or problematic nodes
4. Providing actionable recommendations

DO NOT use this for:
- Checking a specific node (use check_node_health instead)
- Organization analysis (use analyze_organization_health instead)
- Historical trends (use analyze_network_trends instead)

Examples:
- User: "The network seems slow, what's happening?"
- User: "Is Stellar having problems right now?"
- User: "Network health report please"`,
      inputSchema: {
        type: 'object',
        properties: {
          includeTrends: {
            type: 'boolean',
            description: 'Include recent network trends in the analysis (default: false)'
          },
          severityFilter: {
            type: 'string',
            enum: ['all', 'critical', 'warning'],
            description: 'Filter issues by severity level (default: all)'
          }
        }
      }
    };
  }

  monitorValidatorPerformanceTool(): Tool {
    return {
      name: 'monitor_validator_performance',
      description: `Comprehensive validator monitoring and performance analysis.

Use this when a user asks about:
- "How are validators performing?"
- "Which validators are best/worst?"
- "Validator network status"
- "Are validators working properly?"
- "Rank validators by performance"

This tool provides:
1. Current validator status and health
2. Performance rankings and metrics
3. Identification of failing validators
4. Geographic and organizational distribution

DO NOT use this for:
- General network health (use investigate_network_issues instead)
- Specific node analysis (use check_node_health instead)
- Organization focus (use analyze_organization_health instead)

Examples:
- User: "Show me the top 10 validators"
- User: "Are there any validator problems?"
- User: "Validator performance report"`,
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Number of top validators to show (default: 20)'
          },
          sortBy: {
            type: 'string',
            enum: ['uptime', 'performance', 'reliability'],
            description: 'Criteria to rank validators by (default: reliability)'
          },
          includeFailures: {
            type: 'boolean',
            description: 'Include analysis of failing validators (default: true)'
          }
        }
      }
    };
  }

  analyzeOrganizationHealthTool(): Tool {
    return {
      name: 'analyze_organization_health',
      description: `Complete organization health analysis with node details.

Use this when a user asks about:
- "How is [organization] performing?"
- "What nodes does [organization] run?"
- "Is [organization] reliable?"
- "Organization health check"
- "[Organization] validator status"

This tool provides:
1. Organization details and contact information
2. Reliability analysis and uptime statistics
3. All nodes operated by the organization
4. Performance comparison with network averages

DO NOT use this for:
- Network-wide analysis (use investigate_network_issues instead)
- Validator-only focus (use monitor_validator_performance instead)
- Node search by criteria (use search_nodes instead)

Examples:
- User: "How is OBSRVR doing?"
- User: "Tell me about SDF's nodes"
- User: "Is Franklin Templeton reliable?"`,
      inputSchema: {
        type: 'object',
        properties: {
          organizationId: {
            type: 'string',
            description: 'Organization ID to analyze (required)'
          },
          includeHistorical: {
            type: 'boolean',
            description: 'Include historical performance data (default: false)'
          }
        },
        required: ['organizationId']
      }
    };
  }

  analyzeNetworkDiversityTool(): Tool {
    return {
      name: 'analyze_network_diversity',
      description: `Analyze network decentralization and geographic distribution.

Use this when a user asks about:
- "How decentralized is the Stellar network?"
- "Network diversity analysis"
- "Geographic distribution of nodes"
- "Is the network centralized?"
- "Diversity and decentralization report"

This tool analyzes:
1. Geographic distribution of nodes and validators
2. Organizational diversity and concentration
3. Version diversity across the network
4. Potential centralization risks

DO NOT use this for:
- General network health (use investigate_network_issues instead)
- Specific organization analysis (use analyze_organization_health instead)
- Performance metrics (use monitor_validator_performance instead)

Examples:
- User: "Is Stellar decentralized enough?"
- User: "Show me network diversity metrics"
- User: "Geographic distribution analysis"`,
      inputSchema: {
        type: 'object',
        properties: {
          includeInactive: {
            type: 'boolean',
            description: 'Include inactive nodes in diversity analysis (default: false)'
          },
          focusArea: {
            type: 'string',
            enum: ['geographic', 'organizational', 'version', 'all'],
            description: 'Focus area for diversity analysis (default: all)'
          }
        }
      }
    };
  }

  troubleshootConsensusIssuesTool(): Tool {
    return {
      name: 'troubleshoot_consensus_issues',
      description: `Diagnose and analyze consensus problems in detail.

Use this when a user asks about:
- "Why is consensus failing?"
- "Consensus health check"
- "Are there quorum problems?"
- "Network consensus analysis"
- "Why isn't the network agreeing?"

This tool performs:
1. Detailed consensus state analysis
2. Quorum set health evaluation
3. Validator participation assessment
4. Specific consensus issue identification

DO NOT use this for:
- General network status (use investigate_network_issues instead)
- Node performance (use monitor_validator_performance instead)
- Non-consensus issues (use detect_network_issues instead)

Examples:
- User: "The network isn't reaching consensus"
- User: "Quorum intersection problems?"
- User: "Consensus diagnostic report"`,
      inputSchema: {
        type: 'object',
        properties: {
          includeQuorumDetails: {
            type: 'boolean',
            description: 'Include detailed quorum set analysis (default: true)'
          },
          historicalComparison: {
            type: 'boolean',
            description: 'Compare with historical consensus data (default: false)'
          }
        }
      }
    };
  }

  async handleInvestigateNetworkIssues(args: { 
    includeTrends?: boolean; 
    severityFilter?: string 
  }): Promise<any> {
    try {
      logger.info('Starting comprehensive network investigation', { args });

      // Step 1: Get overall network status
      const networkStatus = await this.networkTools.handleGetNetworkStatus({});
      
      // Step 2: Detect specific issues
      const networkIssues = await this.networkTools.handleDetectNetworkIssues({
        severity: args.severityFilter || 'all'
      });

      // Step 3: Find failing nodes
      const failingNodes = await this.nodeTools.handleFindFailingNodes({
        severity: args.severityFilter || 'all'
      });

      // Step 4: Optional trend analysis
      let trends = null;
      if (args.includeTrends) {
        trends = await this.networkTools.handleAnalyzeNetworkTrends({
          timeRange: '24h'
        });
      }

      // Compile comprehensive analysis
      const analysis = {
        investigation: {
          timestamp: new Date().toISOString(),
          severity: args.severityFilter || 'all',
          includedTrends: args.includeTrends || false
        },
        networkOverview: {
          status: networkStatus.status,
          healthScore: networkStatus.healthScore,
          totalNodes: networkStatus.summary.totalNodes,
          activeNodes: networkStatus.summary.activeNodes,
          validators: networkStatus.summary.validators
        },
        criticalIssues: networkIssues.issues?.filter((issue: any) => 
          issue.severity === 'critical'
        ) || [],
        allIssues: networkIssues.issues || [],
        failingNodes: {
          total: failingNodes.summary.total,
          critical: failingNodes.summary.critical,
          validatorsAffected: failingNodes.summary.validatorsAffected,
          details: failingNodes.failingNodes.slice(0, 10) // Top 10 failing nodes
        },
        trends: trends,
        recommendations: this.generateNetworkRecommendations(networkStatus, networkIssues, failingNodes)
      };

      return analysis;
    } catch (error) {
      logger.error('Error investigating network issues', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to investigate network issues: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleMonitorValidatorPerformance(args: {
    limit?: number;
    sortBy?: string;
    includeFailures?: boolean;
  }): Promise<any> {
    try {
      logger.info('Starting validator performance monitoring', { args });

      // Step 1: Get all validators
      const validators = await this.nodeTools.handleGetValidatorNodes({
        activeOnly: false
      });

      // Step 2: Rank validators
      const rankings = await this.nodeTools.handleRankValidators({
        sortBy: args.sortBy || 'reliability',
        limit: args.limit || 20,
        activeOnly: false
      });

      // Step 3: Find failing validators (if requested)
      let failingValidators = null;
      if (args.includeFailures !== false) {
        const failing = await this.nodeTools.handleFindFailingNodes({
          severity: 'all'
        });
        failingValidators = failing.failingNodes.filter((node: any) => node.node.validating);
      }

      const analysis = {
        monitoring: {
          timestamp: new Date().toISOString(),
          criteria: args.sortBy || 'reliability',
          limit: args.limit || 20
        },
        overview: {
          totalValidators: validators.summary.total,
          activeValidators: validators.summary.active,
          overloadedValidators: validators.summary.overloaded
        },
        topPerformers: rankings.validators.slice(0, 10),
        rankings: rankings.validators,
        distribution: rankings.statistics.distributionByOrganization,
        failingValidators: failingValidators?.slice(0, 5) || [],
        recommendations: this.generateValidatorRecommendations(validators, rankings, failingValidators)
      };

      return analysis;
    } catch (error) {
      logger.error('Error monitoring validator performance', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to monitor validator performance: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleAnalyzeOrganizationHealth(args: {
    organizationId: string;
    includeHistorical?: boolean;
  }): Promise<any> {
    try {
      logger.info('Starting organization health analysis', { args });

      // Step 1: Get organization details
      const orgDetails = await this.organizationTools.handleGetOrganizationDetails({
        organizationId: args.organizationId
      });

      // Step 2: Analyze reliability
      const reliability = await this.organizationTools.handleAnalyzeOrganizationReliability({
        organizationId: args.organizationId
      });

      // Step 3: Get organization nodes
      const orgNodes = await this.organizationTools.handleGetOrganizationNodes({
        organizationId: args.organizationId,
        activeOnly: false
      });

      // Step 4: Optional historical data
      let historical = null;
      if (args.includeHistorical) {
        historical = await this.organizationTools.handleGetOrganizationSnapshots({
          organizationId: args.organizationId,
          limit: 30
        });
      }

      const analysis = {
        analysis: {
          timestamp: new Date().toISOString(),
          organizationId: args.organizationId,
          includeHistorical: args.includeHistorical || false
        },
        organization: orgDetails,
        reliability: reliability,
        nodes: {
          summary: orgNodes.summary,
          details: orgNodes.nodes,
          validators: orgNodes.nodes.filter((node: any) => node.validating)
        },
        historical: historical,
        healthScore: this.calculateOrganizationHealthScore(reliability, orgNodes),
        recommendations: this.generateOrganizationRecommendations(orgDetails, reliability, orgNodes)
      };

      return analysis;
    } catch (error) {
      logger.error('Error analyzing organization health', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to analyze organization health: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleAnalyzeNetworkDiversity(args: {
    includeInactive?: boolean;
    focusArea?: string;
  }): Promise<any> {
    try {
      logger.info('Starting network diversity analysis', { args });

      // Step 1: Get all nodes
      const allNodes = await this.nodeTools.handleGetAllNodes({
        activeOnly: !args.includeInactive
      });

      // Step 2: Analyze peer connections for diversity metrics
      const connectivity = await this.nodeTools.handleFindPeerConnections({
        includeInactive: args.includeInactive || false
      });

      // Step 3: Search nodes for geographic analysis
      const searchResults = await this.nodeTools.handleSearchNodes({});

      const analysis = {
        analysis: {
          timestamp: new Date().toISOString(),
          includeInactive: args.includeInactive || false,
          focusArea: args.focusArea || 'all'
        },
        overview: {
          totalNodes: allNodes.summary.total,
          activeNodes: allNodes.summary.active,
          validators: allNodes.summary.validators
        },
        diversity: connectivity.connectivityAnalysis,
        decentralization: {
          score: this.calculateDecentralizationScore(connectivity.connectivityAnalysis),
          risks: this.identifyDecentralizationRisks(connectivity.connectivityAnalysis),
          strengths: this.identifyDecentralizationStrengths(connectivity.connectivityAnalysis)
        },
        recommendations: this.generateDiversityRecommendations(connectivity.connectivityAnalysis)
      };

      return analysis;
    } catch (error) {
      logger.error('Error analyzing network diversity', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to analyze network diversity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleTroubleshootConsensusIssues(args: {
    includeQuorumDetails?: boolean;
    historicalComparison?: boolean;
  }): Promise<any> {
    try {
      logger.info('Starting consensus troubleshooting', { args });

      // Step 1: Check consensus status
      const consensus = await this.networkTools.handleCheckNetworkConsensus({});

      // Step 2: Analyze quorum health
      const quorum = await this.networkTools.handleCheckQuorumHealth({
        includeDetails: args.includeQuorumDetails !== false
      });

      // Step 3: Find failing validators
      const failingValidators = await this.nodeTools.handleFindFailingNodes({
        severity: 'critical'
      });

      // Step 4: Get validator status
      const validators = await this.nodeTools.handleGetValidatorNodes({
        activeOnly: false
      });

      const analysis = {
        troubleshooting: {
          timestamp: new Date().toISOString(),
          includeQuorumDetails: args.includeQuorumDetails !== false,
          historicalComparison: args.historicalComparison || false
        },
        consensusStatus: consensus,
        quorumHealth: quorum,
        validatorParticipation: {
          total: validators.summary.total,
          active: validators.summary.active,
          failing: failingValidators.summary.validatorsAffected
        },
        criticalIssues: this.identifyConsensusIssues(consensus, quorum, failingValidators),
        diagnosis: this.diagnoseConsensusProblems(consensus, quorum, validators),
        recommendations: this.generateConsensusRecommendations(consensus, quorum, failingValidators)
      };

      return analysis;
    } catch (error) {
      logger.error('Error troubleshooting consensus issues', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to troubleshoot consensus issues: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private generateNetworkRecommendations(networkStatus: any, issues: any, failingNodes: any): string[] {
    const recommendations: string[] = [];

    if (networkStatus.healthScore < 50) {
      recommendations.push('URGENT: Network health is critically low. Immediate attention required.');
    }

    if (failingNodes.summary.validatorsAffected > 0) {
      recommendations.push(`${failingNodes.summary.validatorsAffected} validators are affected. Check validator status immediately.`);
    }

    if (issues.issues?.length > 5) {
      recommendations.push('Multiple network issues detected. Prioritize critical issues first.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Network appears stable. Continue regular monitoring.');
    }

    return recommendations;
  }

  private generateValidatorRecommendations(validators: any, rankings: any, failing: any): string[] {
    const recommendations: string[] = [];

    if (validators.summary.active < validators.summary.total * 0.8) {
      recommendations.push('Less than 80% of validators are active. Investigate inactive validators.');
    }

    if (failing?.length > 0) {
      recommendations.push(`${failing.length} validators are failing. Check their health status.`);
    }

    if (rankings.statistics.averageScore < 70) {
      recommendations.push('Average validator performance is below optimal. Consider performance improvements.');
    }

    return recommendations;
  }

  private generateOrganizationRecommendations(details: any, reliability: any, nodes: any): string[] {
    const recommendations: string[] = [];

    if (reliability.overallScore < 80) {
      recommendations.push('Organization reliability is below recommended threshold (80%).');
    }

    const inactiveNodes = nodes.nodes.filter((node: any) => !node.active).length;
    if (inactiveNodes > 0) {
      recommendations.push(`${inactiveNodes} nodes are inactive. Investigate connectivity issues.`);
    }

    return recommendations;
  }

  private generateDiversityRecommendations(diversity: any): string[] {
    const recommendations: string[] = [];

    if (diversity.networkwide?.organizations < 10) {
      recommendations.push('Low organizational diversity. Encourage more organizations to participate.');
    }

    if (diversity.networkwide?.countries < 20) {
      recommendations.push('Limited geographic diversity. Promote global node distribution.');
    }

    return recommendations;
  }

  private generateConsensusRecommendations(consensus: any, quorum: any, failing: any): string[] {
    const recommendations: string[] = [];

    if (!consensus.healthy) {
      recommendations.push('Consensus is unhealthy. Immediate investigation required.');
    }

    if (!consensus.quorumIntersection) {
      recommendations.push('Quorum intersection issues detected. Review quorum set configurations.');
    }

    if (consensus.safetyLevel < 50) {
      recommendations.push('Safety level is critically low. Add more reliable validators.');
    }

    return recommendations;
  }

  private calculateOrganizationHealthScore(reliability: any, nodes: any): number {
    let score = 0;
    
    if (reliability.overallScore) score += reliability.overallScore * 0.6;
    
    const activeRatio = nodes.summary.active / nodes.summary.total;
    score += activeRatio * 40;

    return Math.round(score);
  }

  private calculateDecentralizationScore(diversity: any): number {
    let score = 100;

    // Penalize for high concentration
    if (diversity.redundancy?.organizationalDiversity < 3) score -= 30;
    if (diversity.redundancy?.geographicDiversity < 10) score -= 20;
    if (diversity.redundancy?.versionDiversity < 3) score -= 15;

    return Math.max(0, score);
  }

  private identifyDecentralizationRisks(diversity: any): string[] {
    const risks: string[] = [];

    if (diversity.redundancy?.organizationalDiversity < 3) {
      risks.push('High organizational concentration risk');
    }
    if (diversity.redundancy?.geographicDiversity < 10) {
      risks.push('Limited geographic distribution');
    }

    return risks;
  }

  private identifyDecentralizationStrengths(diversity: any): string[] {
    const strengths: string[] = [];

    if (diversity.redundancy?.organizationalDiversity > 15) {
      strengths.push('Excellent organizational diversity');
    }
    if (diversity.redundancy?.geographicDiversity > 30) {
      strengths.push('Strong geographic distribution');
    }

    return strengths;
  }

  private identifyConsensusIssues(consensus: any, quorum: any, failing: any): string[] {
    const issues: string[] = [];

    if (!consensus.healthy) {
      issues.push('Consensus mechanism is not functioning properly');
    }
    if (!consensus.quorumIntersection) {
      issues.push('Quorum sets do not have proper intersection');
    }
    if (failing.summary.validatorsAffected > 0) {
      issues.push(`${failing.summary.validatorsAffected} validators are failing`);
    }

    return issues;
  }

  private diagnoseConsensusProblems(consensus: any, quorum: any, validators: any): string {
    if (!consensus.healthy && validators.summary.active < 3) {
      return 'Insufficient active validators for safe consensus';
    }
    if (!consensus.quorumIntersection) {
      return 'Quorum set configuration prevents proper consensus';
    }
    if (consensus.safetyLevel === 0) {
      return 'Critical safety failure - network cannot reach consensus';
    }
    return 'Consensus appears functional but may have performance issues';
  }
}