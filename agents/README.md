# AURA Agents

This directory contains the agentic components of AURA (Agentic User-Responsive Architecture).

## Components

### Generator Agent (`generator.js`)
The Generator Agent is responsible for drafting A2UI-compliant JSON blueprints based on user intent and telemetry data. It uses OpenAI GPT-4 to intelligently create UI layouts that match user requirements.

**Key Features:**
- Generates UI blueprints from natural language user intent
- Incorporates real-time telemetry data
- Creates A2UI-compliant JSON structures

### Discriminator Agent (`discriminator.js`)
The Discriminator Agent acts as the "Judge" in the adversarial loop. It validates generated blueprints against YANG hardware models and Knowledge Graph constraints to ensure physically executable and valid configurations.

**Key Features:**
- Validates component structure and requirements
- Cross-references with YANG models
- Integrates with Knowledge Graph for semantic validation
- Uses AI-powered judgment for complex validation scenarios

## Usage

```javascript
const { generateBlueprint, judgeBlueprint } = require('@aura/agents');

// Generate a blueprint
const blueprint = await generateBlueprint('show network dashboard', telemetryData);

// Validate the blueprint
const isValid = await judgeBlueprint(blueprint, yangModels, knowledgeGraph);
```

## Environment Variables

Required environment variables:
- `OPENAI_API_KEY`: Your OpenAI API key for GPT-4 access

## Installation

```bash
npm install
```
