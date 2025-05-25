# Setup Guide - Stellar Network Monitoring MCP Server

This guide provides detailed instructions for setting up the Stellar Network Monitoring MCP Server with various MCP clients.

## Prerequisites

- **Node.js** (>= v18.0.0) - [Download from nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js)
- An MCP-compatible client application

## Supported MCP Clients

### Claude Desktop

**Step 1:** Install Claude Desktop from [claude.ai/download](https://claude.ai/download)

**Step 2:** Locate your configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

**Step 3:** Add the Stellar Network Monitoring server:

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

**Step 4:** Save the file and restart Claude Desktop

### Cursor IDE

**Step 1:** Install Cursor from [cursor.com](https://cursor.com)

**Step 2:** Open Cursor settings and navigate to MCP servers configuration

**Step 3:** Add the following configuration:

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

### Visual Studio Code (Preview)

**Step 1:** Ensure you have the latest VS Code with MCP support

**Step 2:** Open your VS Code settings and configure MCP servers:

```json
{
  "mcp.servers": {
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

### Windsurf Editor

**Step 1:** Install Windsurf from [codeium.com/windsurf](https://codeium.com/windsurf)

**Step 2:** Configure MCP servers in Windsurf settings:

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

## Network Configuration

### Mainnet (Default)

No additional configuration is needed for Stellar Mainnet monitoring:

```json
{
  "mcpServers": {
    "stellar-network-monitoring": {
      "command": "npx",
      "args": ["-y", "stellar-network-monitoring-mcp"]
    }
  }
}
```

### Testnet

To monitor Stellar Testnet, add the environment variable:

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

## Local Development Setup

If you want to run the server locally for development:

### Step 1: Clone and Build

```bash
git clone https://github.com/withObsrvr/stellar-network-monitoring-mcp
cd stellar-network-monitoring-mcp
npm install
npm run build
```

### Step 2: Configure Local Path

```json
{
  "mcpServers": {
    "stellar-network-monitoring": {
      "command": "node",
      "args": ["/path/to/stellar-network-monitoring-mcp/dist/index.js"]
    }
  }
}
```

### Step 3: Development Mode

For active development with auto-rebuild:

```bash
npm run watch  # Keep this running
```

Then restart your MCP client when you want to test changes.

## Troubleshooting

### Common Issues

#### Server Not Starting

**Error**: "Command not found" or "Module not found"

**Solution**: Ensure Node.js and npm are properly installed:

```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 8.0.0
```

#### Network Connection Issues

**Error**: "Failed to connect to API"

**Solutions**:
1. Check your internet connection
2. Verify firewall settings allow HTTPS connections
3. Try switching networks (sometimes corporate firewalls block external APIs)

#### Configuration File Issues

**Error**: "Invalid JSON" or "Configuration not found"

**Solutions**:
1. Validate your JSON syntax using a JSON validator
2. Ensure the configuration file path is correct for your operating system
3. Check file permissions (the file should be readable)

#### Windows-Specific Issues

If you encounter issues on Windows, try using Command Prompt or WSL:

**Command Prompt:**
```json
{
  "mcpServers": {
    "stellar-network-monitoring": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "stellar-network-monitoring-mcp"
      ]
    }
  }
}
```

**WSL (Windows Subsystem for Linux):**
```json
{
  "mcpServers": {
    "stellar-network-monitoring": {
      "command": "wsl",
      "args": [
        "npx",
        "-y",
        "stellar-network-monitoring-mcp"
      ]
    }
  }
}
```

### Logging and Debugging

#### Enable Debug Logging

Add logging configuration to see detailed server activity:

```json
{
  "mcpServers": {
    "stellar-network-monitoring": {
      "command": "npx",
      "args": ["-y", "stellar-network-monitoring-mcp"],
      "env": {
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

#### Check Server Status

You can test the server directly from command line:

```bash
npx -y stellar-network-monitoring-mcp
```

The server should start and wait for MCP client connections.

### Performance Optimization

#### Reduce Startup Time

For faster startup, you can install the package globally:

```bash
npm install -g stellar-network-monitoring-mcp
```

Then update your configuration:

```json
{
  "mcpServers": {
    "stellar-network-monitoring": {
      "command": "stellar-network-monitoring-mcp"
    }
  }
}
```

#### Memory Usage

The server is designed to be lightweight, but if you experience memory issues:

```json
{
  "mcpServers": {
    "stellar-network-monitoring": {
      "command": "node",
      "args": [
        "--max-old-space-size=512",
        "-e",
        "require('stellar-network-monitoring-mcp')"
      ]
    }
  }
}
```

## Verification

### Test the Setup

After configuration, test the server by asking your MCP client:

1. **Basic test**: "What's the current status of the Stellar network?"
2. **Workflow test**: "Investigate any current network issues"
3. **Validator test**: "Show me the top performing validators"

### Expected Response

You should see detailed, formatted responses about the Stellar network status, including:
- Network health scores
- Active node counts
- Validator information
- Any current issues or alerts

## Getting Help

If you continue to experience issues:

1. **Check the logs** in your MCP client for error messages
2. **Verify prerequisites** (Node.js version, network connectivity)
3. **Try the troubleshooting steps** above
4. **Report issues** at [GitHub Issues](https://github.com/withObsrvr/stellar-network-monitoring-mcp/issues)

Include in your issue report:
- Operating system and version
- Node.js version (`node --version`)
- MCP client and version
- Complete error messages
- Your configuration (remove any sensitive information)

## Next Steps

Once setup is complete:
- Read the [Usage Examples](USAGE_EXAMPLES.md) to learn about available features
- Explore the [API Reference](API_REFERENCE.md) for detailed tool documentation
- Check out [Best Practices](BEST_PRACTICES.md) for optimal usage patterns