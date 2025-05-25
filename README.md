# Stellar Network Monitoring MCP Server

**Stellar Network Monitoring MCP Server** is an open-source tool that lets you monitor and analyze the **Stellar blockchain network in natural language**.

[![npm version](https://img.shields.io/npm/v/stellar-network-monitoring-mcp)](https://www.npmjs.com/package/stellar-network-monitoring-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The Model Context Protocol (MCP) is a [new, standardized protocol](https://modelcontextprotocol.io/introduction) designed to manage context between large language models (LLMs) and external systems. This repository offers an MCP Server for comprehensive [Stellar Network](https://stellar.org) monitoring and analysis.

The Stellar Network Monitoring MCP server acts as a bridge between natural language requests and the [Stellar Network Monitoring API](https://radar.withobsrvr.com/api) provided by [Obsrvr](https://withobsrvr.com). Built upon MCP, it translates your requests into the necessary API calls, enabling you to monitor network health, analyze validator performance, investigate issues, and track network diversity seamlessly.

## Key Features

- **Natural language network monitoring:** Monitor Stellar network health using intuitive, conversational commands
- **Comprehensive analysis workflows:** Perform complex investigations without knowing API endpoints or data structures
- **Real-time network insights:** Get up-to-date information about nodes, validators, consensus, and network issues
- **Intelligent troubleshooting:** Automatically correlate data across multiple network components to identify problems
- **Accessibility for all users:** Empower users with varying technical backgrounds to understand network status

For example, in Claude Desktop, or any MCP Client, you can use natural language to accomplish things like:

- `"How is the Stellar network doing? Are there any issues I should know about?"`
- `"Show me the top performing validators and check if any are having problems"`
- `"Analyze OBSRVR's validator health and compare it to other organizations"`
- `"Is the network decentralized enough? What are the geographic and organizational diversity metrics?"`
- `"Why isn't consensus working? Help me troubleshoot the consensus issues"`

> [!NOTE]  
> The Stellar Network Monitoring MCP server provides read-only access to network monitoring data. No sensitive operations or network modifications are possible through this server.

## Setting up Stellar Network Monitoring MCP Server

### Prerequisites

- An MCP Client application (Claude Desktop, Cursor, etc.)
- **Node.js (>= v18.0.0) and npm:** Download from [nodejs.org](https://nodejs.org)

### Installation

**Setup via npm:**

Add the following JSON configuration within the `mcpServers` section of your client's MCP configuration file:

```json
{
  "mcpServers": {
    "stellar-network-monitoring": {
      "command": "npx",
      "args": [
        "-y",
        "stellar-network-monitoring-mcp"
      ]
    }
  }
}
```

**For Claude Desktop:**

1. Open Claude Desktop
2. Go to Settings → Developer  
3. Edit your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "stellar-network-monitoring": {
      "command": "npx",
      "args": [
        "-y", 
        "stellar-network-monitoring-mcp"
      ]
    }
  }
}
```

4. Save the file and restart Claude Desktop

### Environment Configuration

The server supports both Stellar Mainnet and Testnet:

- **Mainnet (default):** No additional configuration needed
- **Testnet:** Set environment variable `STELLAR_NETWORK=testnet`

```json
{
  "mcpServers": {
    "stellar-network-monitoring": {
      "command": "npx",
      "args": ["-y", "stellar-network-monitoring-mcp"],
      "env": {
        "STELLAR_NETWORK": "testnet"
      }
    }
  }
}
```

## Features

### High-Level Workflow Tools

The server provides intelligent workflow tools that combine multiple data sources for comprehensive analysis:

#### **`investigate_network_issues`**
Complete network health investigation workflow that automatically:
- Checks overall network status and health score
- Detects specific network issues and anomalies  
- Identifies failing or problematic nodes
- Provides actionable recommendations

*Use when:* "Is there a problem with the Stellar network?", "Network health check", "What's wrong with Stellar today?"

#### **`monitor_validator_performance`**
Comprehensive validator monitoring and performance analysis:
- Gets current validator status and health
- Ranks validators by performance metrics
- Identifies failing validators
- Analyzes geographic and organizational distribution

*Use when:* "How are validators performing?", "Show me the top validators", "Are there validator problems?"

#### **`analyze_organization_health`**
Complete organization health analysis with node details:
- Retrieves organization details and contact information
- Analyzes reliability and uptime statistics
- Lists all nodes operated by the organization
- Compares performance with network averages

*Use when:* "How is [organization] performing?", "What nodes does [organization] run?", "Is [organization] reliable?"

#### **`analyze_network_diversity`**
Network decentralization and geographic distribution analysis:
- Analyzes geographic distribution of nodes and validators
- Evaluates organizational diversity and concentration
- Assesses version diversity across the network
- Identifies potential centralization risks

*Use when:* "How decentralized is Stellar?", "Network diversity analysis", "Is the network centralized?"

#### **`troubleshoot_consensus_issues`**
Detailed consensus problem diagnosis:
- Analyzes current consensus state and health
- Evaluates quorum set configurations
- Assesses validator participation
- Identifies specific consensus issues

*Use when:* "Why is consensus failing?", "Consensus health check", "Are there quorum problems?"

### Core Monitoring Tools

#### **Network Tools**
- **`get_network_status`**: Quick overview of network health and status
- **`check_network_consensus`**: Analyze consensus health and safety
- **`detect_network_issues`**: Identify current network problems
- **`analyze_network_trends`**: Historical network behavior analysis
- **`generate_network_report`**: Comprehensive network health reports

#### **Node Tools**
- **`search_nodes`**: Find nodes using flexible search criteria
- **`check_node_health`**: Assess health status of specific nodes
- **`find_failing_nodes`**: Identify nodes with issues or poor performance
- **`get_validator_nodes`**: List validator nodes with voting status
- **`compare_nodes`**: Compare performance between multiple nodes
- **`rank_validators`**: Rank validators by performance criteria

#### **Organization Tools**
- **`get_organization_details`**: Get detailed organization information
- **`get_organization_nodes`**: List nodes operated by specific organizations

## Example Use Cases

### For Network Operators
- Monitor overall network health and identify issues quickly
- Track validator performance and reliability
- Analyze network diversity and decentralization
- Get alerts about connectivity or consensus problems

### For Node Operators
- Monitor their nodes' health and performance
- Compare their nodes against network averages
- Get insights about optimal validator configurations
- Track uptime and reliability metrics

### For Researchers & Analysts
- Study network behavior and consensus patterns
- Analyze geographic distribution of infrastructure
- Research validator performance and reliability trends
- Monitor network decentralization metrics

### For Developers
- Check network status before deploying applications
- Monitor transaction processing capabilities
- Analyze network capacity and performance
- Debug connectivity and consensus issues

## API Integration

This server integrates with the Stellar Network Monitoring API provided by Obsrvr:

- **Production**: `https://radar.withobsrvr.com/api`
- **Testnet**: `https://radar.withobsrvr.com/testnet-api`

The server includes comprehensive error handling:
- Rate limiting with automatic backoff
- Network timeout handling  
- API error response parsing
- Graceful degradation when services are unavailable

## Development

### Prerequisites for Development

- Node.js (>= v18.0.0)
- npm or yarn
- TypeScript

### Setup

```bash
git clone https://github.com/withObsrvr/stellar-network-monitoring-mcp
cd stellar-network-monitoring-mcp
npm install
npm run build
```

### Development Scripts

- `npm run build` - Build TypeScript to JavaScript
- `npm run dev` - Run in development mode with hot reload
- `npm test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Development with MCP Client

For testing during development:

```bash
npm run build
npm run watch # Keep this running for auto-rebuild
node dist/index.js
```

Then restart your MCP client to test changes.

### Project Structure

```
src/
├── api/           # API client for Stellar network data
├── tools/         # MCP tool implementations
│   ├── network.ts     # Network monitoring tools
│   ├── nodes.ts       # Node management tools
│   ├── organizations.ts # Organization tools
│   └── workflows.ts   # High-level workflow tools
├── types/         # TypeScript type definitions
├── utils/         # Utility functions and logging
└── index.ts       # Main server entry point
```

## Testing

```bash
npm test
```

Tests cover:
- API client functionality
- Tool implementations
- Error handling
- Type safety

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/withObsrvr/stellar-network-monitoring-mcp/issues)
- **Documentation**: [Obsrvr Documentation](https://docs.withobsrvr.com)
- **Community**: [Stellar Community](https://stellar.org/community)

## Related Projects

- [Stellar Network](https://stellar.org) - The Stellar blockchain network
- [Obsrvr](https://withobsrvr.com) - Comprehensive blockchain infrastructure monitoring
- [Model Context Protocol](https://modelcontextprotocol.io) - Protocol for LLM-system integration
- [Claude Desktop](https://claude.ai/download) - AI assistant with MCP support

---

Built with ❤️ by [Obsrvr](https://withobsrvr.com) for the Stellar community.