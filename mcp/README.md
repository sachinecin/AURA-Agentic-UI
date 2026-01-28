# AURA MCP Server

This directory contains the Model Context Protocol (MCP) server for AURA's Trusted Component Catalog.

## Overview

The MCP server provides a standardized interface for accessing trusted UI components. It implements the Model Context Protocol specification, allowing AI agents and other systems to query and retrieve pre-validated UI components.

## Features

- **Trusted Component Catalog**: Maintains a registry of verified UI components
- **MCP Protocol Compliance**: Fully implements the Model Context Protocol specification
- **Tool Interface**: Exposes `get_component` tool for component retrieval
- **Stdio Transport**: Uses standard input/output for communication

## Available Tools

### `get_component`
Retrieves a trusted UI component by its identifier.

**Parameters:**
- `componentId` (string, required): The unique identifier of the component

**Returns:**
- Component definition in JSON format

## Usage

### As a Standalone Server

```bash
npm start
```

The server runs on stdio transport and can be integrated with MCP-compatible clients.

### Integration Example

```javascript
const { ComponentCatalogServer } = require('@aura/mcp-server');

const server = new ComponentCatalogServer();
await server.run();
```

## Component Catalog

Currently supported components:
- `button`: Button component with label and action
- `input`: Input field with placeholder

Additional components can be added by extending the `getComponent` method in `server.js`.

## Installation

```bash
npm install
```

## Dependencies

- `@modelcontextprotocol/sdk`: MCP SDK for server implementation
