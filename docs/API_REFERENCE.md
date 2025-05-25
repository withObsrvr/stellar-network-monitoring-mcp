# API Reference - Stellar Network Monitoring MCP Server

This document provides detailed technical reference for all available tools in the Stellar Network Monitoring MCP Server.

## High-Level Workflow Tools

These tools combine multiple API calls to provide comprehensive analysis workflows.

### `investigate_network_issues`

Performs a complete network health investigation with automatic issue detection and recommendations.

**Parameters:**
- `includeTrends` (boolean, optional): Include recent network trends in analysis
- `severityFilter` (string, optional): Filter issues by severity - `all`, `critical`, `warning`

**Response Structure:**
```json
{
  "investigation": {
    "timestamp": "2024-01-15T10:30:00Z",
    "severity": "all",
    "includedTrends": false
  },
  "networkOverview": {
    "status": "poor",
    "healthScore": 65,
    "totalNodes": 697,
    "activeNodes": 188,
    "validators": 84
  },
  "criticalIssues": [
    {
      "severity": "critical",
      "description": "Multiple validators offline",
      "affectedNodes": ["..."],
      "recommendedActions": ["..."]
    }
  ],
  "allIssues": [...],
  "failingNodes": {
    "total": 15,
    "critical": 3,
    "validatorsAffected": 2,
    "details": [...]
  },
  "recommendations": [
    "URGENT: Network health is critically low...",
    "Check validator status immediately..."
  ]
}
```

---

### `monitor_validator_performance`

Comprehensive validator monitoring with performance rankings and failure analysis.

**Parameters:**
- `limit` (number, optional): Number of top validators to show (default: 20)
- `sortBy` (string, optional): Ranking criteria - `uptime`, `performance`, `reliability`
- `includeFailures` (boolean, optional): Include failing validator analysis (default: true)

**Response Structure:**
```json
{
  "monitoring": {
    "timestamp": "2024-01-15T10:30:00Z",
    "criteria": "reliability",
    "limit": 20
  },
  "overview": {
    "totalValidators": 84,
    "activeValidators": 75,
    "overloadedValidators": 2
  },
  "topPerformers": [
    {
      "rank": 1,
      "publicKey": "GA...",
      "name": "OBSRVR Validator 1",
      "organizationId": "341fdc78bd09a5c0f0f421e5bb643882",
      "score": 98.5,
      "uptime": 99.8
    }
  ],
  "failingValidators": [...]
}
```

---

### `analyze_organization_health`

Complete health analysis for a specific organization including all nodes and performance metrics.

**Parameters:**
- `organizationId` (string, required): Organization ID to analyze
- `includeHistorical` (boolean, optional): Include historical performance data

**Response Structure:**
```json
{
  "analysis": {
    "timestamp": "2024-01-15T10:30:00Z",
    "organizationId": "341fdc78bd09a5c0f0f421e5bb643882",
    "includeHistorical": false
  },
  "organization": {
    "id": "341fdc78bd09a5c0f0f421e5bb643882",
    "name": "OBSRVR",
    "description": "Comprehensive infrastructure solutions...",
    "website": "https://withobsrvr.com",
    "contact": {...}
  },
  "reliability": {
    "overallScore": 95.2,
    "uptime": 99.1,
    "performance": 94.5
  },
  "nodes": {
    "summary": {
      "total": 3,
      "active": 3,
      "validators": 3
    },
    "details": [...],
    "validators": [...]
  },
  "healthScore": 95,
  "recommendations": [...]
}
```

---

### `analyze_network_diversity`

Analyzes network decentralization across geographic, organizational, and version dimensions.

**Parameters:**
- `includeInactive` (boolean, optional): Include inactive nodes in analysis
- `focusArea` (string, optional): Focus area - `geographic`, `organizational`, `version`, `all`

**Response Structure:**
```json
{
  "analysis": {
    "timestamp": "2024-01-15T10:30:00Z",
    "includeInactive": false,
    "focusArea": "all"
  },
  "diversity": {
    "networkwide": {
      "totalNodes": 188,
      "organizations": 20,
      "versions": 5,
      "countries": 25
    },
    "distribution": {
      "byOrganization": {...},
      "byVersion": {...},
      "byLocation": {...}
    },
    "redundancy": {
      "organizationalDiversity": 3.2,
      "geographicDiversity": 25,
      "versionDiversity": 5
    }
  },
  "decentralization": {
    "score": 85,
    "risks": ["High organizational concentration in top 3 orgs"],
    "strengths": ["Excellent geographic distribution"]
  }
}
```

---

### `troubleshoot_consensus_issues`

Detailed consensus problem diagnosis with quorum analysis and validator participation assessment.

**Parameters:**
- `includeQuorumDetails` (boolean, optional): Include detailed quorum analysis (default: true)
- `historicalComparison` (boolean, optional): Compare with historical consensus data

**Response Structure:**
```json
{
  "troubleshooting": {
    "timestamp": "2024-01-15T10:30:00Z",
    "includeQuorumDetails": true,
    "historicalComparison": false
  },
  "consensusStatus": {
    "healthy": false,
    "issues": ["Insufficient active validators"],
    "quorumIntersection": false,
    "safetyLevel": 0
  },
  "quorumHealth": {...},
  "validatorParticipation": {
    "total": 84,
    "active": 75,
    "failing": 5
  },
  "criticalIssues": [
    "Consensus mechanism not functioning properly",
    "Quorum sets lack proper intersection"
  ],
  "diagnosis": "Insufficient active validators for safe consensus",
  "recommendations": [
    "Add more reliable validators",
    "Review quorum set configurations"
  ]
}
```

## Core Network Tools

### `get_network_status`

Quick overview of current network health and basic metrics.

**Parameters:**
- `at` (string, optional): ISO 8601 datetime for historical data

**Response Structure:**
```json
{
  "status": "poor",
  "healthScore": 21.4,
  "summary": {
    "totalNodes": 697,
    "activeNodes": 188,
    "validators": 0,
    "overloadedNodes": 3,
    "organizations": 20
  },
  "consensus": {
    "healthy": false,
    "validatorsOnline": 0,
    "potentialIssues": ["3 nodes are overloaded"]
  }
}
```

---

### `check_network_consensus`

Analyzes consensus health, safety levels, and quorum intersection.

**Parameters:**
- `at` (string, optional): ISO 8601 datetime for historical data

**Response Structure:**
```json
{
  "healthy": false,
  "issues": [
    "Insufficient number of active validators for safe consensus",
    "Potential quorum intersection issues detected"
  ],
  "quorumIntersection": false,
  "safetyLevel": 0
}
```

---

### `detect_network_issues`

Identifies current network problems categorized by type and severity.

**Parameters:**
- `severity` (string, optional): Filter by severity - `all`, `critical`, `warning`, `info`
- `category` (string, optional): Filter by category - `all`, `consensus`, `performance`, `connectivity`, `validators`

**Response Structure:**
```json
{
  "issues": [
    {
      "severity": "critical",
      "type": "consensus",
      "description": "Multiple validators offline affecting consensus",
      "affectedNodes": ["GA...", "GB..."],
      "recommendedActions": [
        "Contact validator operators",
        "Monitor consensus status"
      ],
      "detectedAt": "2024-01-15T10:25:00Z"
    }
  ],
  "summary": {
    "total": 5,
    "critical": 2,
    "warning": 3,
    "byCategory": {
      "consensus": 2,
      "performance": 2,
      "connectivity": 1
    }
  }
}
```

---

### `analyze_network_trends`

Historical analysis of network behavior patterns over specified time periods.

**Parameters:**
- `timeRange` (string, optional): Time range - `24h`, `7d`, `30d`, `90d` (default: 7d)
- `metric` (string, optional): Specific metric - `nodes`, `validators`, `uptime`, `consensus`, `organizations`

**Response Structure:**
```json
{
  "trends": [
    {
      "metric": "activeNodes",
      "timeframe": "7d",
      "values": [
        {"timestamp": "2024-01-08T00:00:00Z", "value": 195},
        {"timestamp": "2024-01-09T00:00:00Z", "value": 192},
        ...
      ],
      "trend": "declining",
      "changePercentage": -3.2
    }
  ],
  "summary": {
    "timeRange": "7d",
    "overallTrend": "declining",
    "keyChanges": [
      "Active nodes decreased by 3.2%",
      "Validator count remained stable"
    ]
  }
}
```

---

### `generate_network_report`

Creates comprehensive network health reports with customizable detail levels.

**Parameters:**
- `reportType` (string, optional): Report type - `summary`, `detailed`, `executive`
- `timeRange` (string, optional): Data timeframe - `current`, `24h`, `7d`, `30d`
- `includeRecommendations` (boolean, optional): Include actionable recommendations

**Response Structure:**
```json
{
  "report": {
    "id": "report-20240115-103000",
    "type": "detailed",
    "generatedAt": "2024-01-15T10:30:00Z",
    "timeRange": "current"
  },
  "summary": {
    "totalNodes": 697,
    "healthyNodes": 185,
    "issues": 8,
    "overallHealth": "poor"
  },
  "details": {
    "consensus": {...},
    "performance": {...},
    "topIssues": [...],
    "trends": [...]
  },
  "recommendations": [
    "Immediate attention required for consensus issues",
    "Monitor validator participation closely"
  ]
}
```

## Node Tools

### `search_nodes`

Flexible node search with multiple filter criteria.

**Parameters:**
- `location` (string, optional): Geographic location filter
- `version` (string, optional): Stellar Core version filter  
- `organizationId` (string, optional): Organization ID filter
- `active` (boolean, optional): Active status filter
- `validating` (boolean, optional): Validator status filter
- `overLoaded` (boolean, optional): Overload status filter
- `minUptime` (number, optional): Minimum uptime percentage (0-100)
- `at` (string, optional): ISO 8601 datetime for historical data

**Response Structure:**
```json
{
  "nodes": [
    {
      "publicKey": "GA2PU4UGMLSFUXGZATHPTDXXX7FOHBAQC57RSJCQUN72WFKTD6CEPQSF",
      "name": "OBSRVR Validator 2",
      "host": "core-live-2.nodeswithobsrvr.co:11625",
      "port": 11625,
      "active": true,
      "validating": true,
      "overLoaded": false,
      "stellarCoreVersion": "19.5.0",
      "organizationId": "341fdc78bd09a5c0f0f421e5bb643882",
      "geography": {
        "countryName": "United States",
        "countryCode": "US"
      },
      "uptime": 99.8,
      "lastSeen": "2024-01-15T10:29:45Z"
    }
  ],
  "filters": {...},
  "summary": {
    "total": 3,
    "active": 3,
    "validators": 3,
    "overloaded": 0
  }
}
```

---

### `check_node_health`

Detailed health assessment for a specific node.

**Parameters:**
- `publicKey` (string, required): Node's public key

**Response Structure:**
```json
{
  "status": "healthy",
  "issues": [],
  "score": 98
}
```

For unhealthy nodes:
```json
{
  "status": "warning",
  "issues": [
    "Low uptime: 85%",
    "Node is overloaded"
  ],
  "score": 65
}
```

---

### `find_failing_nodes`

Identifies nodes with performance issues or failures.

**Parameters:**
- `at` (string, optional): ISO 8601 datetime for historical data
- `severity` (string, optional): Filter by severity - `all`, `critical`, `warning`

**Response Structure:**
```json
{
  "failingNodes": [
    {
      "node": {
        "publicKey": "GC...",
        "name": "Example Node",
        "host": "node.example.com",
        "active": false,
        "validating": true,
        "overLoaded": false,
        "uptime": 75.2,
        "organizationId": "abc123"
      },
      "issues": [
        "Node is offline",
        "Validator is offline"
      ],
      "severity": "critical"
    }
  ],
  "summary": {
    "total": 15,
    "critical": 3,
    "warning": 12,
    "validatorsAffected": 2
  }
}
```

---

### `get_validator_nodes`

Lists all validator nodes with their current status and metrics.

**Parameters:**
- `at` (string, optional): ISO 8601 datetime for historical data
- `activeOnly` (boolean, optional): Filter to active validators only (default: true)

**Response Structure:**
```json
{
  "validators": [
    {
      "publicKey": "GA...",
      "name": "OBSRVR Validator 1",
      "host": "core-live-1.nodeswithobsrvr.co:11625",
      "active": true,
      "validating": true,
      "overLoaded": false,
      "stellarCoreVersion": "19.5.0",
      "organizationId": "341fdc78bd09a5c0f0f421e5bb643882",
      "geography": {...},
      "uptime": 99.8,
      "quorumSet": {...},
      "lastSeen": "2024-01-15T10:29:45Z"
    }
  ],
  "summary": {
    "total": 84,
    "active": 75,
    "overloaded": 2,
    "byOrganization": {
      "OBSRVR": 3,
      "SDF": 3,
      "Franklin Templeton": 3
    }
  }
}
```

---

### `compare_nodes`

Compares performance metrics between multiple specified nodes.

**Parameters:**
- `publicKeys` (array, required): Array of node public keys to compare
- `metrics` (array, optional): Metrics to compare - `uptime`, `performance`, `connectivity`, `version`, `geography`
- `at` (string, optional): ISO 8601 datetime for historical data

**Response Structure:**
```json
{
  "comparison": [
    {
      "publicKey": "GA...",
      "name": "Node 1",
      "organizationId": "org1",
      "uptime": {
        "current": 99.8,
        "trend": "stable"
      },
      "performance": 95,
      "connectivity": {
        "active": true,
        "overLoaded": false,
        "lastSeen": "2024-01-15T10:29:45Z"
      },
      "version": "19.5.0",
      "geography": {...}
    }
  ],
  "summary": {
    "totalNodes": 3,
    "validNodes": 3,
    "uptimeStats": {
      "highest": 99.8,
      "lowest": 97.2,
      "average": 98.5
    }
  },
  "recommendations": [
    "All nodes appear to be performing well"
  ]
}
```

---

### `rank_validators`

Ranks validators by specified performance criteria.

**Parameters:**
- `sortBy` (string, optional): Ranking criteria - `uptime`, `performance`, `reliability`, `stake`, `age`
- `limit` (number, optional): Maximum validators to return (default: 50)
- `at` (string, optional): ISO 8601 datetime for historical data
- `activeOnly` (boolean, optional): Filter to active validators only (default: true)

**Response Structure:**
```json
{
  "validators": [
    {
      "rank": 1,
      "publicKey": "GA...",
      "name": "Top Validator",
      "organizationId": "org1",
      "geography": {...},
      "active": true,
      "uptime": 99.9,
      "stellarCoreVersion": "19.5.0",
      "score": 98.5
    }
  ],
  "ranking": {
    "criteria": "reliability",
    "total": 84,
    "shown": 50
  },
  "statistics": {
    "averageScore": 85.2,
    "topScore": 98.5,
    "distributionByOrganization": {...}
  }
}
```

## Organization Tools

### `get_organization_details`

Retrieves comprehensive information about a specific organization.

**Parameters:**
- `organizationId` (string, required): Organization ID
- `at` (string, optional): ISO 8601 datetime for historical data

**Response Structure:**
```json
{
  "id": "341fdc78bd09a5c0f0f421e5bb643882",
  "name": "OBSRVR",
  "description": "Comprehensive infrastructure solutions for blockchain networks.",
  "website": "https://withobsrvr.com",
  "keybase": null,
  "twitter": "withObsrvr",
  "github": "withObsrvr",
  "totalNodes": 3,
  "validators": 3,
  "physicalAddress": "Dayton, Ohio, USA",
  "officialEmail": "info@withobsrvr.com",
  "phoneNumber": null,
  "homeDomain": "stellar.withobsrvr.com"
}
```

---

### `get_organization_nodes`

Lists all nodes operated by a specific organization.

**Parameters:**
- `organizationId` (string, required): Organization ID
- `activeOnly` (boolean, optional): Filter to active nodes only (default: false)
- `at` (string, optional): ISO 8601 datetime for historical data

**Response Structure:**
```json
{
  "organizationId": "341fdc78bd09a5c0f0f421e5bb643882",
  "nodes": [
    {
      "publicKey": "GA2PU4UGMLSFUXGZATHPTDXXX7FOHBAQC57RSJCQUN72WFKTD6CEPQSF",
      "name": "OBSRVR Validator 2",
      "host": "core-live-2.nodeswithobsrvr.co:11625",
      "port": 11625,
      "active": true,
      "overLoaded": false,
      "statistics": {
        "has24HourStats": true,
        "active24HoursPercentage": 100,
        "validating24HoursPercentage": 100,
        "overLoaded24HoursPercentage": 0
      }
    }
  ],
  "summary": {
    "total": 3,
    "active": 3,
    "validators": 3,
    "overloaded": 0,
    "byVersion": {
      "Unknown": 3
    },
    "byCountry": {
      "Unknown": 3
    }
  }
}
```

## Error Handling

All tools include comprehensive error handling. Common error responses:

### API Connection Errors
```json
{
  "error": "Failed to connect to Stellar network monitoring API",
  "tool": "get_network_status",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Invalid Parameters
```json
{
  "error": "Node with public key 'invalid-key' not found",
  "tool": "check_node_health",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Rate Limiting
```json
{
  "error": "Rate limit exceeded. Please try again in 60 seconds",
  "tool": "get_all_nodes",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Historical Data

Most tools support historical data queries using the `at` parameter:

```json
{
  "at": "2024-01-14T12:00:00Z"
}
```

Time formats supported:
- ISO 8601: `2024-01-15T10:30:00Z`
- ISO 8601 with timezone: `2024-01-15T10:30:00-05:00`
- Relative times: Not currently supported (use absolute timestamps)

## Rate Limits

The server implements intelligent rate limiting:
- **Workflow tools**: 1 request per 10 seconds
- **Core tools**: 5 requests per 10 seconds  
- **Simple queries**: 10 requests per 10 seconds

Rate limits are per-client and automatically reset. The server implements exponential backoff for API calls to the upstream Stellar monitoring service.