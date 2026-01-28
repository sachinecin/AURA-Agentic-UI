// Temporal workflows for AURA

const { generateBlueprint } = require('../agents/generator');
const { judgeBlueprint } = require('../agents/discriminator');

async function adversarialSynthesisWorkflow(userIntent, telemetry, yangModels, knowledgeGraph, maxRetries = 3) {
  let attempts = 0;
  let lastRejectionReason = null;

  while (attempts < maxRetries) {
    attempts++;
    
    // Generator Agent drafts blueprint (with feedback from previous rejection)
    const prompt = lastRejectionReason 
      ? `${userIntent} (Previous attempt rejected: ${lastRejectionReason})`
      : userIntent;
    
    const blueprint = await generateBlueprint(prompt, telemetry);

    // Discriminator Agent judges
    const approved = await judgeBlueprint(blueprint, yangModels, knowledgeGraph);

    if (approved) {
      // Success - return validated blueprint
      return blueprint;
    }

    // Store rejection for next iteration
    lastRejectionReason = `Blueprint validation failed on attempt ${attempts}`;
  }

  // Max retries exceeded
  throw new Error(`Failed to generate valid blueprint after ${maxRetries} attempts`);
}

module.exports = { adversarialSynthesisWorkflow };