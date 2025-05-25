export interface NetworkInfo {
  nodes: Node[];
  organizations: Organization[];
  statistics: NetworkStatistics;
  updatedAt: string;
}

export interface NetworkStatistics {
  totalNodes: number;
  activeNodes: number;
  validators: number;
  organizations: number;
  averageUptime: number;
  consensusHealth: number;
}

export interface Node {
  publicKey: string;
  name?: string;
  host?: string;
  port?: number;
  organizationId?: string;
  active: boolean;
  overLoaded: boolean;
  validating: boolean;
  // History archive properties
  historyUrl?: string;
  historyArchiveHasError?: boolean;
  isFullValidator?: boolean;
  // API compatibility properties
  isValidating?: boolean;
  isValidator?: boolean;
  stellarCoreVersion?: string;
  versionStr?: string;
  uptime?: number;
  geography?: Geography;
  geoData?: Geography;
  statistics?: NodeStatistics;
  quorumSet?: QuorumSet;
  lastSeen?: string;
}

export interface NodeSnapshot {
  publicKey: string;
  dateCreated: string;
  active: boolean;
  overLoaded: boolean;
  validating: boolean;
  stellarCoreVersion?: string;
  uptime?: number;
  geography?: Geography;
  statistics?: NodeStatistics;
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  url?: string;
  website?: string;
  keybase?: string;
  twitter?: string;
  github?: string;
  validators: string[];
  nodes?: string[];
  statistics?: OrganizationStatistics;
  physicalAddress?: string;
  officialEmail?: string;
  phoneNumber?: string;
  homeDomain?: string;
  dateDiscovered?: string;
  dba?: string;
  horizonUrl?: string;
}

export interface OrganizationSnapshot {
  organizationId: string;
  dateCreated: string;
  validators: string[];
  isTierOneOrganization: boolean;
  subQuorumAvailable: boolean;
  subQuorumThreshold: number;
  statistics?: OrganizationStatistics;
}

export interface Geography {
  countryCode?: string;
  countryName?: string;
  longitude?: number;
  latitude?: number;
}

export interface NodeStatistics {
  uptime?: number;
  has24HourStats?: boolean;
  has30DayStats?: boolean;
  overLoadedCount?: number;
  validatingCount?: number;
  activeCount?: number;
  // API specific properties
  active24HoursPercentage?: number;
  validating24HoursPercentage?: number;
  overLoaded24HoursPercentage?: number;
  active30DaysPercentage?: number;
  validating30DaysPercentage?: number;
  overLoaded30DaysPercentage?: number;
}

export interface OrganizationStatistics {
  uptime?: number;
  activeNodes?: number;
  validatingNodes?: number;
  totalNodes?: number;
}

export interface QuorumSet {
  threshold: number;
  validators: string[];
  innerQuorumSets?: QuorumSet[];
}

export interface HealthCheck {
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  score: number;
}

export interface NetworkConsensusInfo {
  healthy: boolean;
  issues: string[];
  quorumIntersection: boolean;
  safetyLevel: number;
}

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  uptimePercentage: number;
}

export interface NetworkTrend {
  metric: string;
  timeframe: string;
  values: { timestamp: string; value: number }[];
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercentage: number;
}

export interface NetworkIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  affectedNodes?: string[];
  recommendedActions: string[];
  detectedAt: string;
}

export interface NodeComparison {
  nodes: string[];
  metrics: {
    [metric: string]: {
      [nodePublicKey: string]: number;
    };
  };
  rankings: {
    metric: string;
    ranking: { publicKey: string; value: number; rank: number }[];
  }[];
}

export interface NetworkReport {
  summary: {
    totalNodes: number;
    healthyNodes: number;
    issues: number;
    overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
  };
  details: {
    consensus: NetworkConsensusInfo;
    performance: PerformanceMetrics;
    topIssues: NetworkIssue[];
    trends: NetworkTrend[];
  };
  generatedAt: string;
}

export interface SearchFilters {
  country?: string;
  version?: string;
  organization?: string;
  validating?: boolean;
  active?: boolean;
  minUptime?: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}