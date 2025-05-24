# Stellar Network Monitoring MCP Server

A Model Context Protocol (MCP) server that provides real-time monitoring and analysis capabilities for the Stellar network. This server exposes Stellar network data through standardized tools that can be consumed by AI assistants and other MCP clients.

## Features

### Core Network Monitoring
- **Network Status**: Get overall network health, consensus status, and key metrics
- **Network Statistics**: Retrieve comprehensive network-wide statistics
- **Consensus Analysis**: Analyze current consensus state and potential issues

### Node Management
- **Node Discovery**: List all nodes with current status and basic information
- **Node Details**: Get detailed information about specific nodes
- **Health Checks**: Assess health status of individual nodes
- **Failure Detection**: Identify nodes with issues or poor performance
- **Validator Monitoring**: Monitor validator nodes and their voting status

### Organization Tracking
- **Organization Listing**: List all organizations operating Stellar nodes
- **Organization Details**: Get detailed organization information
- **Reliability Analysis**: Assess organization's node reliability and uptime
- **Organization Nodes**: List all nodes operated by specific organizations

## Installation

```bash
npm install
npm run build
```

## Usage

### Running the Server

```bash
npm start
```

### Development Mode

```bash
npm run dev
```

### Environment Variables

- `STELLAR_NETWORK`: Set to `testnet` to use Stellar testnet (default: mainnet)
- `LOG_LEVEL`: Set logging level (default: `info`)

## Available Tools

### Network Tools
- `get_network_status` - Get overall network health and status
- `get_network_statistics` - Retrieve network-wide statistics
- `check_network_consensus` - Analyze consensus state and issues

### Node Tools
- `get_all_nodes` - List all nodes in the network
- `get_node_details` - Get detailed node information by public key
- `check_node_health` - Assess health of a specific node
- `find_failing_nodes` - Identify nodes with issues
- `get_validator_nodes` - List validator nodes with voting status

### Organization Tools
- `get_all_organizations` - List all organizations
- `get_organization_details` - Get organization details by ID
- `analyze_organization_reliability` - Assess organization reliability
- `get_organization_nodes` - List nodes operated by an organization

## API Integration

This server integrates with the Stellar Network Monitoring API provided by Obsrvr:

- **Production**: `https://radar.withobsrvr.com/api`
- **Testnet**: `https://radar.withobsrvr.com/testnet-api`

## Error Handling

The server includes comprehensive error handling:
- Rate limiting with automatic backoff
- Network timeout handling
- API error response parsing
- Graceful degradation when services are unavailable

## Development

### Scripts

- `npm run build` - Build TypeScript to JavaScript
- `npm run dev` - Run in development mode with hot reload
- `npm test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Project Structure

```
src/
├── api/           # API client for Stellar network data
├── tools/         # MCP tool implementations
├── types/         # TypeScript type definitions
├── utils/         # Utility functions and logging
└── index.ts       # Main server entry point
```

## License

MIT