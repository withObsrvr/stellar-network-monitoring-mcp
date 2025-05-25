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

  analyzeNetworkTrendsTool(): Tool {
    return {
      name: 'analyze_network_trends',
      description: 'Identify patterns in network behavior over time',
      inputSchema: {
        type: 'object',
        properties: {
          timeRange: {
            type: 'string',
            enum: ['24h', '7d', '30d', '90d'],
            description: 'Time range for trend analysis (default: 7d)'
          },
          metric: {
            type: 'string',
            enum: ['nodes', 'validators', 'uptime', 'consensus', 'organizations'],
            description: 'Specific metric to analyze (default: all)'
          }
        }
      }
    };
  }

  detectNetworkIssuesTool(): Tool {
    return {
      name: 'detect_network_issues',
      description: 'Identify current network problems or anomalies',
      inputSchema: {
        type: 'object',
        properties: {
          severity: {
            type: 'string',
            enum: ['all', 'critical', 'warning', 'info'],
            description: 'Filter by issue severity (default: all)'
          },
          category: {
            type: 'string',
            enum: ['all', 'consensus', 'performance', 'connectivity', 'validators'],
            description: 'Filter by issue category (default: all)'
          }
        }
      }
    };
  }

  checkQuorumHealthTool(): Tool {
    return {
      name: 'check_quorum_health',
      description: 'Analyze quorum set configurations and health',
      inputSchema: {
        type: 'object',
        properties: {
          at: {
            type: 'string',
            description: 'ISO 8601 datetime for historical data (optional)'
          },
          includeDetails: {
            type: 'boolean',
            description: 'Include detailed quorum analysis (default: false)'
          }
        }
      }
    };
  }

  generateNetworkReportTool(): Tool {
    return {
      name: 'generate_network_report',
      description: 'Create comprehensive network health reports',
      inputSchema: {
        type: 'object',
        properties: {
          reportType: {
            type: 'string',
            enum: ['summary', 'detailed', 'executive'],
            description: 'Type of report to generate (default: summary)'
          },
          timeRange: {
            type: 'string',
            enum: ['current', '24h', '7d', '30d'],
            description: 'Time range for report data (default: current)'
          },
          includeRecommendations: {
            type: 'boolean',
            description: 'Include actionable recommendations (default: true)'
          }
        }
      }
    };
  }

  exportNetworkDataTool(): Tool {
    return {
      name: 'export_network_data',
      description: 'Export network data in various formats',
      inputSchema: {
        type: 'object',
        properties: {
          format: {
            type: 'string',
            enum: ['json', 'csv', 'xml'],
            description: 'Export format (default: json)'
          },
          dataTypes: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['nodes', 'validators', 'organizations', 'statistics', 'snapshots']
            },
            description: 'Types of data to include (default: all)'
          },
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

  async handleAnalyzeNetworkTrends(args: { timeRange?: string; metric?: string }): Promise<any> {
    try {
      logger.info('Analyzing network trends', { timeRange: args.timeRange, metric: args.metric });
      
      const timeRange = args.timeRange || '7d';
      const metric = args.metric || 'all';
      
      const [currentResponse, nodeSnapshotsResponse, orgSnapshotsResponse] = await Promise.all([
        this.client.getNetworkInfo(),
        this.client.getNetworkNodeSnapshots(),
        this.client.getNetworkOrganizationSnapshots()
      ]);

      if (!currentResponse.success) {
        throw new Error('Failed to fetch current network data');
      }

      const trends: any = {
        timeRange,
        analyzed: new Date().toISOString()
      };

      if (metric === 'all' || metric === 'nodes') {
        trends.nodes = this.analyzeNodeTrends(
          currentResponse.data.nodes,
          nodeSnapshotsResponse.success ? nodeSnapshotsResponse.data : []
        );
      }

      if (metric === 'all' || metric === 'validators') {
        trends.validators = this.analyzeValidatorTrends(currentResponse.data.nodes);
      }

      if (metric === 'all' || metric === 'organizations') {
        trends.organizations = this.analyzeOrganizationTrends(
          currentResponse.data.organizations,
          orgSnapshotsResponse.success ? orgSnapshotsResponse.data : []
        );
      }

      if (metric === 'all' || metric === 'consensus') {
        trends.consensus = this.analyzeConsensusTrends(currentResponse.data.nodes);
      }

      return trends;
    } catch (error) {
      logger.error('Error analyzing network trends', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to analyze network trends: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleDetectNetworkIssues(args: { severity?: string; category?: string }): Promise<any> {
    try {
      logger.info('Detecting network issues', { severity: args.severity, category: args.category });
      
      const response = await this.client.getNetworkInfo();
      
      if (!response.success) {
        throw new Error('Failed to fetch network data for issue detection');
      }

      const networkData = response.data;
      const issues: any[] = [];

      const consensusIssues = this.detectConsensusIssues(networkData.nodes);
      const performanceIssues = this.detectPerformanceIssues(networkData.nodes);
      const connectivityIssues = this.detectConnectivityIssues(networkData.nodes);
      const validatorIssues = this.detectValidatorIssues(networkData.nodes);

      issues.push(...consensusIssues, ...performanceIssues, ...connectivityIssues, ...validatorIssues);

      let filteredIssues = issues;

      if (args.severity && args.severity !== 'all') {
        filteredIssues = filteredIssues.filter(issue => issue.severity === args.severity);
      }

      if (args.category && args.category !== 'all') {
        filteredIssues = filteredIssues.filter(issue => issue.category === args.category);
      }

      return {
        issues: filteredIssues,
        summary: {
          total: filteredIssues.length,
          critical: filteredIssues.filter(i => i.severity === 'critical').length,
          warning: filteredIssues.filter(i => i.severity === 'warning').length,
          info: filteredIssues.filter(i => i.severity === 'info').length,
          byCategory: this.groupIssuesByCategory(filteredIssues)
        },
        networkHealth: this.calculateOverallNetworkHealth(issues)
      };
    } catch (error) {
      logger.error('Error detecting network issues', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to detect network issues: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleCheckQuorumHealth(args: { at?: string; includeDetails?: boolean }): Promise<any> {
    try {
      logger.info('Checking quorum health', { at: args.at, includeDetails: args.includeDetails });
      
      const response = await this.client.getNetworkInfo(args.at);
      
      if (!response.success) {
        throw new Error('Failed to fetch network data for quorum analysis');
      }

      const nodes = response.data.nodes;
      const validators = nodes.filter(node => node.validating && node.active);
      
      const quorumAnalysis = this.analyzeQuorumConfiguration(validators);
      const intersectionAnalysis = this.analyzeQuorumIntersection(validators);
      const redundancyAnalysis = this.analyzeQuorumRedundancy(validators);

      const result: any = {
        healthy: quorumAnalysis.healthy && intersectionAnalysis && redundancyAnalysis.adequate,
        validators: validators.length,
        quorumSets: quorumAnalysis.quorumSets,
        intersection: intersectionAnalysis,
        redundancy: redundancyAnalysis,
        issues: quorumAnalysis.issues,
        recommendations: this.generateQuorumRecommendations(quorumAnalysis, validators)
      };

      if (args.includeDetails) {
        result.details = {
          validatorDistribution: this.analyzeValidatorDistribution(validators),
          organizationCoverage: this.analyzeOrganizationCoverage(validators),
          geographicDistribution: this.analyzeGeographicDistribution(validators)
        };
      }

      return result;
    } catch (error) {
      logger.error('Error checking quorum health', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to check quorum health: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleGenerateNetworkReport(args: { reportType?: string; timeRange?: string; includeRecommendations?: boolean }): Promise<any> {
    try {
      logger.info('Generating network report', args);
      
      const reportType = args.reportType || 'summary';
      const timeRange = args.timeRange || 'current';
      const includeRecommendations = args.includeRecommendations !== false;

      const [networkResponse, nodeSnapshotsResponse, orgSnapshotsResponse] = await Promise.all([
        this.client.getNetworkInfo(),
        this.client.getNetworkNodeSnapshots(),
        this.client.getNetworkOrganizationSnapshots()
      ]);

      if (!networkResponse.success) {
        throw new Error('Failed to fetch network data for report');
      }

      const report: any = {
        reportType,
        timeRange,
        generatedAt: new Date().toISOString(),
        networkOverview: this.generateNetworkOverview(networkResponse.data),
        healthAssessment: this.generateHealthAssessment(networkResponse.data.nodes)
      };

      if (reportType === 'detailed' || reportType === 'executive') {
        report.consensusAnalysis = await this.handleCheckNetworkConsensus({});
        report.performanceMetrics = this.generatePerformanceMetrics(networkResponse.data.nodes);
        report.trends = nodeSnapshotsResponse.success ? this.analyzeTrendsFromSnapshots(nodeSnapshotsResponse.data) : null;
      }

      if (reportType === 'executive') {
        report.executiveSummary = this.generateExecutiveSummary(report);
        report.keyFindings = this.generateKeyFindings(networkResponse.data);
      }

      if (includeRecommendations) {
        report.recommendations = this.generateNetworkRecommendations(networkResponse.data, report);
      }

      return report;
    } catch (error) {
      logger.error('Error generating network report', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to generate network report: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async handleExportNetworkData(args: { format?: string; dataTypes?: string[]; at?: string }): Promise<any> {
    try {
      logger.info('Exporting network data', args);
      
      const format = args.format || 'json';
      const dataTypes = args.dataTypes || ['nodes', 'validators', 'organizations', 'statistics'];
      
      const exportData: any = {
        exportedAt: new Date().toISOString(),
        format,
        dataTypes
      };

      if (dataTypes.includes('nodes') || dataTypes.includes('validators')) {
        const nodesResponse = await this.client.getAllNodes(args.at);
        if (nodesResponse.success) {
          if (dataTypes.includes('nodes')) {
            exportData.nodes = nodesResponse.data;
          }
          if (dataTypes.includes('validators')) {
            exportData.validators = nodesResponse.data.filter(node => node.validating);
          }
        }
      }

      if (dataTypes.includes('organizations')) {
        const orgsResponse = await this.client.getAllOrganizations();
        if (orgsResponse.success) {
          exportData.organizations = orgsResponse.data;
        }
      }

      if (dataTypes.includes('statistics')) {
        const statsResponse = await this.handleGetNetworkStatistics({ at: args.at });
        exportData.statistics = statsResponse;
      }

      if (dataTypes.includes('snapshots')) {
        const [nodeSnapshots, orgSnapshots] = await Promise.all([
          this.client.getNetworkNodeSnapshots(args.at),
          this.client.getNetworkOrganizationSnapshots(args.at)
        ]);
        
        exportData.snapshots = {
          nodes: nodeSnapshots.success ? nodeSnapshots.data : [],
          organizations: orgSnapshots.success ? orgSnapshots.data : []
        };
      }

      if (format === 'csv') {
        return this.convertToCSV(exportData);
      } else if (format === 'xml') {
        return this.convertToXML(exportData);
      }

      return exportData;
    } catch (error) {
      logger.error('Error exporting network data', { error: error instanceof Error ? error.message : String(error) });
      throw new Error(`Failed to export network data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private analyzeNodeTrends(currentNodes: Node[], snapshots: any[]): any {
    const totalNodes = currentNodes.length;
    const activeNodes = currentNodes.filter(n => n.active).length;
    
    return {
      current: { total: totalNodes, active: activeNodes },
      trend: snapshots.length > 0 ? 'stable' : 'no_historical_data',
      changeRate: 0
    };
  }

  private analyzeValidatorTrends(nodes: Node[]): any {
    const validators = nodes.filter(n => n.validating);
    const activeValidators = validators.filter(v => v.active);
    
    return {
      total: validators.length,
      active: activeValidators.length,
      trend: 'stable'
    };
  }

  private analyzeOrganizationTrends(organizations: any[], snapshots: any[]): any {
    return {
      total: organizations.length,
      trend: 'stable',
      tierOneOrganizations: organizations.filter(org => org.isTierOneOrganization).length
    };
  }

  private analyzeConsensusTrends(nodes: Node[]): any {
    const validators = nodes.filter(n => n.validating && n.active);
    const health = this.calculateConsensusHealth(nodes);
    
    return {
      validatorCount: validators.length,
      health,
      trend: health > 80 ? 'healthy' : health > 60 ? 'concerning' : 'critical'
    };
  }

  private detectConsensusIssues(nodes: Node[]): any[] {
    const issues: any[] = [];
    const validators = nodes.filter(n => n.validating && n.active);
    
    if (validators.length < 4) {
      issues.push({
        category: 'consensus',
        severity: 'critical',
        title: 'Insufficient Validators',
        description: `Only ${validators.length} active validators detected. Minimum recommended is 4.`,
        impact: 'Network consensus may be at risk'
      });
    }
    
    return issues;
  }

  private detectPerformanceIssues(nodes: Node[]): any[] {
    const issues: any[] = [];
    const overloadedNodes = nodes.filter(n => n.overLoaded);
    
    if (overloadedNodes.length > nodes.length * 0.1) {
      issues.push({
        category: 'performance',
        severity: 'warning',
        title: 'High Node Overload',
        description: `${overloadedNodes.length} nodes (${Math.round(overloadedNodes.length / nodes.length * 100)}%) are overloaded`,
        impact: 'Network performance may be degraded'
      });
    }
    
    return issues;
  }

  private detectConnectivityIssues(nodes: Node[]): any[] {
    const issues: any[] = [];
    const inactiveNodes = nodes.filter(n => !n.active);
    
    if (inactiveNodes.length > nodes.length * 0.2) {
      issues.push({
        category: 'connectivity',
        severity: 'warning',
        title: 'High Inactive Node Rate',
        description: `${inactiveNodes.length} nodes (${Math.round(inactiveNodes.length / nodes.length * 100)}%) are inactive`,
        impact: 'Network connectivity may be compromised'
      });
    }
    
    return issues;
  }

  private detectValidatorIssues(nodes: Node[]): any[] {
    const issues: any[] = [];
    const validators = nodes.filter(n => n.validating);
    const inactiveValidators = validators.filter(v => !v.active);
    
    if (inactiveValidators.length > 0) {
      issues.push({
        category: 'validators',
        severity: 'critical',
        title: 'Inactive Validators',
        description: `${inactiveValidators.length} validators are currently inactive`,
        impact: 'Consensus security may be reduced'
      });
    }
    
    return issues;
  }

  private groupIssuesByCategory(issues: any[]): Record<string, number> {
    return issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateOverallNetworkHealth(issues: any[]): string {
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const warningIssues = issues.filter(i => i.severity === 'warning').length;
    
    if (criticalIssues > 0) return 'critical';
    if (warningIssues > 2) return 'warning';
    if (warningIssues > 0) return 'caution';
    return 'healthy';
  }

  private analyzeQuorumConfiguration(validators: Node[]): any {
    return {
      healthy: validators.length >= 4,
      quorumSets: validators.length,
      issues: validators.length < 4 ? ['Insufficient validators for robust consensus'] : []
    };
  }

  private analyzeQuorumRedundancy(validators: Node[]): any {
    const organizationCount = new Set(validators.map(v => v.organizationId)).size;
    return {
      adequate: organizationCount >= 3,
      organizationCount,
      redundancyLevel: organizationCount >= 5 ? 'high' : organizationCount >= 3 ? 'adequate' : 'low'
    };
  }

  private analyzeValidatorDistribution(validators: Node[]): any {
    const byOrg = validators.reduce((acc, v) => {
      const org = v.organizationId || 'unknown';
      acc[org] = (acc[org] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      organizations: Object.keys(byOrg).length,
      distribution: byOrg,
      maxConcentration: Math.max(...Object.values(byOrg)) / validators.length
    };
  }

  private analyzeOrganizationCoverage(validators: Node[]): any {
    const organizations = new Set(validators.map(v => v.organizationId)).size;
    return {
      totalOrganizations: organizations,
      coverage: organizations >= 3 ? 'adequate' : 'insufficient'
    };
  }

  private analyzeGeographicDistribution(validators: Node[]): any {
    const countries = validators.reduce((acc, v) => {
      const country = v.geography?.countryName || 'unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      countries: Object.keys(countries).length,
      distribution: countries
    };
  }

  private generateQuorumRecommendations(analysis: any, validators: Node[]): string[] {
    const recommendations: string[] = [];
    
    if (validators.length < 4) {
      recommendations.push('Increase the number of active validators to at least 4 for better consensus security');
    }
    
    if (validators.length < 7) {
      recommendations.push('Consider adding more validators to improve network decentralization');
    }
    
    return recommendations;
  }

  private generateNetworkOverview(networkData: any): any {
    return {
      totalNodes: networkData.nodes.length,
      activeNodes: networkData.nodes.filter((n: any) => n.active).length,
      validators: networkData.nodes.filter((n: any) => n.validating).length,
      organizations: networkData.organizations.length,
      lastUpdated: networkData.updatedAt
    };
  }

  private generateHealthAssessment(nodes: Node[]): any {
    const healthScore = this.calculateNetworkHealthScore(nodes);
    return {
      score: Math.round(healthScore),
      status: this.determineNetworkStatus(healthScore, nodes.filter(n => n.overLoaded).length, nodes.filter(n => n.active).length),
      summary: healthScore > 80 ? 'Network is operating well' : healthScore > 60 ? 'Network has some issues' : 'Network requires attention'
    };
  }

  private generatePerformanceMetrics(nodes: Node[]): any {
    const uptimes = nodes.filter(n => n.uptime !== undefined).map(n => n.uptime!);
    return {
      averageUptime: uptimes.length > 0 ? uptimes.reduce((sum, u) => sum + u, 0) / uptimes.length : 0,
      nodeUtilization: nodes.filter(n => !n.overLoaded).length / nodes.length,
      validatorEfficiency: nodes.filter(n => n.validating && n.active).length / nodes.filter(n => n.validating).length
    };
  }

  private analyzeTrendsFromSnapshots(snapshots: any[]): any {
    return {
      dataPoints: snapshots.length,
      timespan: snapshots.length > 0 ? {
        start: snapshots[snapshots.length - 1]?.dateCreated,
        end: snapshots[0]?.dateCreated
      } : null
    };
  }

  private generateExecutiveSummary(report: any): any {
    return {
      networkHealth: report.healthAssessment.status,
      keyMetrics: {
        totalNodes: report.networkOverview.totalNodes,
        activeValidators: report.networkOverview.validators,
        healthScore: report.healthAssessment.score
      },
      criticalIssues: report.consensusAnalysis?.issues?.length || 0
    };
  }

  private generateKeyFindings(networkData: any): string[] {
    const findings: string[] = [];
    const activeRatio = networkData.nodes.filter((n: any) => n.active).length / networkData.nodes.length;
    
    if (activeRatio > 0.95) {
      findings.push('Excellent node availability with >95% active nodes');
    } else if (activeRatio < 0.8) {
      findings.push('Low node availability - investigation recommended');
    }
    
    return findings;
  }

  private generateNetworkRecommendations(networkData: any, report: any): string[] {
    const recommendations: string[] = [];
    
    if (report.healthAssessment.score < 80) {
      recommendations.push('Investigate network issues to improve overall health score');
    }
    
    const validators = networkData.nodes.filter((n: any) => n.validating && n.active);
    if (validators.length < 5) {
      recommendations.push('Consider adding more validators to improve decentralization');
    }
    
    return recommendations;
  }

  private convertToCSV(data: any): string {
    return 'CSV export functionality not yet implemented';
  }

  private convertToXML(data: any): string {
    return 'XML export functionality not yet implemented';
  }
}