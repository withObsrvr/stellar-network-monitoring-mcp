# Stellar Network Monitoring MCP Server - Claude Code Memory

## Project Overview
This is a **Model Context Protocol (MCP) server** for monitoring the Stellar blockchain network using natural language. It provides a bridge between AI assistants and the Stellar Network Monitoring API from Obsrvr.

### Key Concepts
- **MCP**: Model Context Protocol - standardized protocol for LLM-system integration
- **Stellar Network**: Decentralized blockchain network with validators and consensus
- **Validators**: Nodes that participate in consensus and vote on transactions
- **Quorum Sets**: Configuration defining which validators a node trusts
- **History Archives**: Ledger history storage for network synchronization
- **Obsrvr**: Infrastructure monitoring service providing the underlying API

## Development Commands

### Build & Development
```bash
npm run build           # Compile TypeScript to JavaScript
npm run dev            # Development mode with hot reload using tsx
npm run watch          # TypeScript watch mode for continuous compilation
npm start              # Run compiled JavaScript version
```

### Quality & Testing
```bash
npm run test           # Run Jest test suite
npm run test:watch     # Run tests in watch mode
npm run lint           # Run ESLint on TypeScript files
npm run lint:fix       # Auto-fix ESLint issues
npm run typecheck      # TypeScript type checking without compilation
```

### Pre-publish
```bash
npm run prepare        # Build before install (Git hooks)
npm run prepublishOnly # Test and lint before publishing
```

## Architecture

### Project Structure
```
src/
├── api/client.ts           # HTTP client for Obsrvr API integration
├── tools/                  # MCP tool implementations
│   ├── workflows.ts        # High-level analysis workflows
│   ├── network.ts          # Network status and health tools
│   ├── nodes.ts           # Node management and search tools
│   └── organizations.ts    # Organization analysis tools
├── types/index.ts          # TypeScript type definitions
├── utils/logger.ts         # Winston logging configuration
└── index.ts               # MCP server entry point
```

### Tool Categories
1. **Workflow Tools**: High-level analysis combining multiple data sources
2. **Network Tools**: Overall network status, consensus, and issues
3. **Node Tools**: Individual node monitoring and comparison
4. **Organization Tools**: Organization-level analysis and node listings

## Code Conventions

### TypeScript Patterns
- Use strict typing with interfaces defined in `src/types/index.ts`
- Prefer `async/await` over Promises for API calls
- Use optional chaining (`?.`) for potentially undefined properties
- Export interfaces and types for reuse across modules

### MCP Tool Structure
Each tool follows this pattern:
```typescript
{
  name: "tool_name",
  description: "Clear description for AI assistant",
  inputSchema: {
    type: "object",
    properties: { /* parameter definitions */ }
  }
}
```

### API Integration
- Base URLs: Mainnet `https://radar.withobsrvr.com/api`, Testnet `https://radar.withobsrvr.com/testnet-api`
- All API calls go through `src/api/client.ts`
- Handle rate limiting, timeouts, and error responses gracefully
- Use axios for HTTP requests with proper error handling

### Error Handling
- Wrap API calls in try-catch blocks
- Return meaningful error messages to users
- Log errors using Winston logger
- Gracefully degrade when services are unavailable

## Dependencies & Stack

### Core Dependencies
- `@modelcontextprotocol/sdk`: MCP protocol implementation
- `axios`: HTTP client for API requests
- `winston`: Structured logging
- `date-fns`: Date manipulation utilities

### Development Dependencies
- `typescript`: Static typing
- `tsx`: TypeScript execution for development
- `jest` + `ts-jest`: Testing framework
- `eslint` + `@typescript-eslint/*`: Code linting
- `@types/*`: Type definitions

### Node.js Requirements
- Minimum Node.js version: 18.0.0
- Uses ES modules and modern JavaScript features

## Common Patterns

### API Response Handling
```typescript
try {
  const response = await apiClient.get('/endpoint');
  return { success: true, data: response.data };
} catch (error) {
  logger.error('API call failed', { error: error.message });
  return { success: false, error: 'User-friendly error message' };
}
```

### Tool Parameter Validation
- Use optional parameters with sensible defaults
- Validate required parameters in tool handlers
- Provide clear error messages for invalid inputs

### Data Transformation
- Normalize API responses to consistent interfaces
- Handle missing or undefined properties gracefully
- Convert timestamps to readable formats when needed

## Testing Strategy
- Unit tests for individual tool functions
- API client mocking for reliable tests
- Type safety verification
- Error condition testing

## Performance Considerations
- API calls are the primary bottleneck
- Implement request caching where appropriate
- Use pagination for large data sets
- Minimize redundant API calls in workflow tools

## Stellar Network Context
When working with this codebase, understand that:
- **Validators** are special nodes that participate in consensus
- **Organizations** can operate multiple nodes/validators
- **Network health** depends on validator uptime and consensus
- **History archives** store ledger data for synchronization
- **Quorum sets** define trust relationships between validators