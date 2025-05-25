# Usage Examples - Stellar Network Monitoring MCP Server

This document provides practical examples of how to use the Stellar Network Monitoring MCP Server with natural language commands.

## Quick Start Examples

### Basic Network Health Check

**You ask:** "How is the Stellar network doing?"

**Server response:** 
- Overall health score (0-100)
- Number of active nodes and validators
- Basic consensus status
- Any immediate concerns

**Tools used:** `get_network_status`

---

### Comprehensive Network Investigation

**You ask:** "Is there a problem with the Stellar network? I need a full investigation."

**Server response:**
- Complete network health analysis
- Specific issues and their severity
- Failing nodes identification
- Actionable recommendations
- Optional trend analysis

**Tools used:** `investigate_network_issues` (workflow tool)

## Validator Monitoring Examples

### Top Performing Validators

**You ask:** "Show me the top 10 validators by reliability"

**Server response:**
- Ranked list of top validators
- Performance scores and metrics
- Organization information
- Geographic distribution
- Uptime statistics

**Tools used:** `monitor_validator_performance`

---

### Validator Problem Detection

**You ask:** "Are there any validators having problems right now?"

**Server response:**
- List of failing or underperforming validators
- Specific issues for each validator
- Impact on network consensus
- Severity levels (critical, warning)
- Recovery recommendations

**Tools used:** `find_failing_nodes` + `get_validator_nodes`

---

### Validator Comparison

**You ask:** "Compare the performance of OBSRVR, SDF, and Franklin Templeton validators"

**Server response:**
- Side-by-side performance comparison
- Uptime percentages
- Reliability scores
- Geographic distribution
- Recommendations for improvement

**Tools used:** `compare_nodes` (after finding org validators)

## Organization Analysis Examples

### Organization Health Report

**You ask:** "How is OBSRVR performing? Give me a full health analysis."

**Server response:**
- Organization details and contact info
- All nodes operated by OBSRVR
- Reliability analysis and uptime stats
- Performance vs. network averages
- Health score and recommendations

**Tools used:** `analyze_organization_health` (workflow tool)

---

### Organization Node Listing

**You ask:** "What nodes does the Stellar Development Foundation run?"

**Server response:**
- Complete list of SDF nodes
- Node status (active/inactive)
- Validator vs. non-validator nodes
- Geographic locations
- Version information

**Tools used:** `get_organization_nodes`

## Network Diversity & Decentralization

### Decentralization Analysis

**You ask:** "How decentralized is the Stellar network? Are there any centralization risks?"

**Server response:**
- Geographic distribution analysis
- Organizational diversity metrics
- Version diversity across nodes
- Potential centralization risks
- Decentralization score (0-100)
- Strengths and weaknesses

**Tools used:** `analyze_network_diversity` (workflow tool)

---

### Geographic Distribution

**You ask:** "Show me the geographic distribution of Stellar validators"

**Server response:**
- Nodes grouped by country/region
- Geographic diversity metrics
- Potential single points of failure
- Recommendations for improvement

**Tools used:** `search_nodes` with location analysis

## Consensus and Technical Issues

### Consensus Troubleshooting

**You ask:** "Why isn't the network reaching consensus? Help me troubleshoot this."

**Server response:**
- Detailed consensus state analysis
- Quorum set health evaluation
- Validator participation assessment
- Specific consensus issues identified
- Technical diagnosis and recommendations

**Tools used:** `troubleshoot_consensus_issues` (workflow tool)

---

### Quorum Analysis

**You ask:** "Are there any quorum intersection problems?"

**Server response:**
- Quorum intersection status
- Safety level assessment
- Potential quorum configuration issues
- Impact on consensus
- Resolution recommendations

**Tools used:** `check_network_consensus` + `check_quorum_health`

## Node Search and Analysis

### Finding Specific Nodes

**You ask:** "Find all active validators in Germany"

**Server response:**
- List of German validators
- Active/inactive status
- Performance metrics
- Organization information
- Contact details

**Tools used:** `search_nodes` with location and validator filters

---

### Version Analysis

**You ask:** "Which nodes are running outdated Stellar Core versions?"

**Server response:**
- Nodes grouped by version
- Outdated vs. current versions
- Security and performance implications
- Update recommendations

**Tools used:** `search_nodes` with version filtering

---

### Node Health Check

**You ask:** "Check the health of node GDRCZ4IPJR7V3HK4GR45CRTE72SDAOZUF2TDBQ5E5IGWC4KM5TSKU2LS"

**Server response:**
- Detailed health assessment
- Performance score (0-100)
- Specific issues identified
- Uptime statistics
- Recommendations for improvement

**Tools used:** `check_node_health`

## Historical Analysis

### Network Trends

**You ask:** "Show me the network trends over the past week"

**Server response:**
- Node count trends
- Validator participation trends
- Uptime trends
- Consensus health trends
- Key changes and patterns

**Tools used:** `analyze_network_trends`

---

### Performance Over Time

**You ask:** "How has OBSRVR's validator performance changed over the past month?"

**Server response:**
- Historical performance data
- Trend analysis (improving/declining/stable)
- Uptime changes
- Reliability trends
- Performance comparisons

**Tools used:** `analyze_organization_health` with historical data

## Issue Detection and Alerts

### Current Network Issues

**You ask:** "What issues are happening on the network right now?"

**Server response:**
- All current network issues
- Issue severity levels
- Affected components
- Impact assessment
- Resolution recommendations

**Tools used:** `detect_network_issues`

---

### Critical Issues Only

**You ask:** "Show me only critical network problems"

**Server response:**
- Critical issues only
- Immediate impact assessment
- Urgent action items
- Escalation recommendations

**Tools used:** `detect_network_issues` with critical severity filter

## Advanced Workflows

### Pre-Deployment Check

**You ask:** "I'm about to deploy a new application. Is the Stellar network ready?"

**Workflow response:**
1. Network health overview
2. Consensus status verification
3. Current issue detection
4. Performance metrics check
5. Go/no-go recommendation

**Tools used:** Multiple workflow tools in sequence

---

### Network Monitoring Dashboard

**You ask:** "Give me a complete network monitoring dashboard"

**Comprehensive response:**
1. Network status overview
2. Validator performance summary
3. Current issues and alerts
4. Diversity and decentralization metrics
5. Key trends and changes
6. Action items and recommendations

**Tools used:** Multiple workflow and core tools

## Real-World Scenarios

### Scenario: Network Outage Investigation

**You report:** "Users are reporting transaction failures. What's happening?"

**Investigation process:**
1. Network health check reveals issues
2. Consensus analysis shows validator problems
3. Failing node identification
4. Root cause analysis
5. Impact assessment
6. Recovery recommendations

**Tools used:** `investigate_network_issues` (comprehensive workflow)

---

### Scenario: Validator Selection

**You ask:** "I want to add a validator to my quorum set. Which ones should I trust?"

**Analysis process:**
1. Rank all validators by reliability
2. Analyze organizational diversity
3. Check geographic distribution
4. Review performance history
5. Provide recommendations with rationale

**Tools used:** `monitor_validator_performance` + `analyze_network_diversity`

---

### Scenario: Network Research

**You ask:** "I'm writing a research paper on Stellar's decentralization. Help me gather data."

**Research assistance:**
1. Comprehensive diversity analysis
2. Historical trend data
3. Geographic distribution studies
4. Organizational concentration metrics
5. Comparison with other networks
6. Data export for further analysis

**Tools used:** `analyze_network_diversity` + `analyze_network_trends`

## Best Practices for Natural Language Commands

### Be Specific About Your Needs

**Good:** "Check the health of OBSRVR's validators and compare them to network averages"
**Better:** "Analyze OBSRVR's organization health with historical comparison"

### Specify Time Ranges When Relevant

**Good:** "Show me network trends"
**Better:** "Show me network trends over the past 7 days"

### Ask for Context When Needed

**Good:** "Are there network issues?"
**Better:** "Are there any critical network issues I should know about before deploying my app?"

### Combine Related Queries

**Good:** "What validators are failing?" followed by "Why are they failing?"
**Better:** "Investigate current validator problems and tell me why they're failing"

### Use Workflow Commands for Complex Analysis

**Instead of:** Multiple separate queries about network health, issues, and recommendations
**Use:** "Investigate network issues" (single workflow command)

## Error Handling Examples

### When Nodes Are Not Found

**You ask:** "Check the health of node ABC123..."

**Response:** "Node with public key ABC123... was not found. Please verify the public key is correct."

### When Organizations Don't Exist

**You ask:** "Analyze XYZ organization health"

**Response:** "Organization 'XYZ' was not found. Here are some similar organizations: [list]"

### When API is Unavailable

**You ask:** "What's the network status?"

**Response:** "Unable to connect to Stellar network monitoring API. The network might be experiencing issues, or there could be a connectivity problem."

## Tips for Power Users

1. **Use workflow tools** for comprehensive analysis instead of multiple separate queries
2. **Specify filters** to get exactly the data you need
3. **Ask for historical context** when investigating issues
4. **Request recommendations** to get actionable insights
5. **Combine geographic and organizational filters** for precise node searches
6. **Use trend analysis** to understand patterns over time
7. **Check consensus health** when investigating performance issues

The MCP server is designed to understand natural language, so feel free to ask questions in your own words. The examples above show the range of possible queries, but the server can handle many variations and combinations.