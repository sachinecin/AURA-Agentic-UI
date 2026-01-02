// Discriminator Agent: Judges the blueprint against constraints

const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const yangModels = JSON.parse(fs.readFileSync('./yang-models.json', 'utf8'));
const kg = JSON.parse(fs.readFileSync('./kg.json', 'utf8'));

async function judgeBlueprint(blueprint, yangModels, knowledgeGraph) {
  // Real checks
  for (const comp of blueprint.components) {
    if (comp.type === 'button' && !comp.action) {
      return false; // Invalid action
    }
    if (comp.type === 'chart' && !comp.data) {
      return false; // Missing data
    }
  }

  // AI judgment
  const prompt = `Judge if this A2UI blueprint is valid against YANG models: ${JSON.stringify(yangModels)}. Knowledge Graph: ${JSON.stringify(knowledgeGraph)}. Blueprint: ${JSON.stringify(blueprint)}. Respond with 'approved' or 'rejected' and reason.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  const result = response.choices[0].message.content;
  return result.toLowerCase().includes('approved');
}

module.exports = { judgeBlueprint };