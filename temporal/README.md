# AURA Temporal Workflows

This directory contains Temporal workflow definitions for durable execution in AURA.

## Overview

Temporal workflows provide durable, fault-tolerant execution for AURA's adversarial UI generation process. This ensures that the Generator-Discriminator loop can recover from failures and maintain consistency even in distributed environments.

## Workflows

### Adversarial Synthesis Workflow (`workflows.js`)

The core workflow that orchestrates the Generator-Discriminator agent loop for UI generation.

**Process:**
1. Generator Agent drafts an A2UI-compliant blueprint
2. Discriminator Agent validates the blueprint against constraints
3. If rejected, the workflow retries with feedback
4. If approved, returns the validated blueprint

**Features:**
- Automatic retry logic for rejected blueprints
- Durable execution across failures
- State persistence for long-running processes

## Usage

### Basic Usage

```javascript
const { adversarialSynthesisWorkflow } = require('@aura/temporal-workflows');

// Execute the workflow
const blueprint = await adversarialSynthesisWorkflow(
  userIntent,
  telemetry,
  yangModels,
  knowledgeGraph
);
```

### Production Deployment

For production use, integrate with Temporal.io:

1. Start a Temporal server
2. Configure workflow workers
3. Submit workflows via Temporal client

```javascript
const { Connection, Client } = require('@temporalio/client');

const connection = await Connection.connect();
const client = new Client({ connection });

await client.workflow.execute(adversarialSynthesisWorkflow, {
  taskQueue: 'aura-workflows',
  workflowId: 'aura-ui-generation-' + Date.now(),
  args: [userIntent, telemetry, yangModels, knowledgeGraph],
});
```

## Architecture

The workflow implements the "Generative Adversarial UI" pattern:

```
┌─────────────────┐
│  User Intent    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generator Agent │ ──► Draft Blueprint
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Discriminator    │ ──► Validate
│    (Judge)      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
Reject    Approve
    │         │
    │         ▼
    │    ┌─────────┐
    └───►│  Retry  │
         └─────────┘
```

## Environment Setup

For development (in-memory state):
```bash
npm start
```

For production (with Temporal.io):
```bash
# Requires Temporal server running
npm run worker
```

## Dependencies

- `@temporalio/client`: Temporal client for workflow execution
- `@temporalio/worker`: Temporal worker for running workflows
- `@temporalio/workflow`: Workflow definitions
- `@temporalio/activity`: Activity definitions

## Installation

```bash
npm install
```
