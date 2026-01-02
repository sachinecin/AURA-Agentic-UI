// Temporal workflows for AURA

const { generateBlueprint } = require('../agents/generator');
const { judgeBlueprint } = require('../agents/discriminator');

export async function adversarialSynthesisWorkflow(userIntent, telemetry, yangModels, knowledgeGraph) {
  // Generator Agent drafts blueprint
  const blueprint = await generateBlueprint(userIntent, telemetry);

  // Discriminator Agent judges
  const approved = await judgeBlueprint(blueprint, yangModels, knowledgeGraph);

  if (!approved) {
    // Retry or handle rejection
    return adversarialSynthesisWorkflow(userIntent, telemetry, yangModels, knowledgeGraph);
  }

  // Proceed to render
  return blueprint;
}