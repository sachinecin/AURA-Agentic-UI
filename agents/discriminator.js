// Discriminator Agent: Judges the blueprint against constraints

const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

let openai;
let yangModels;
let kg;

function getOpenAIClient() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

function loadConstraints() {
  if (!yangModels || !kg) {
    // Try to load from backend directory (when used as module)
    const backendPath = path.join(__dirname, '..', 'backend');
    const yangPath = path.join(backendPath, 'yang-models.json');
    const kgPath = path.join(backendPath, 'kg.json');
    
    if (fs.existsSync(yangPath)) {
      yangModels = JSON.parse(fs.readFileSync(yangPath, 'utf8'));
    }
    if (fs.existsSync(kgPath)) {
      kg = JSON.parse(fs.readFileSync(kgPath, 'utf8'));
    }
  }
  return { yangModels, kg };
}

async function judgeBlueprint(blueprint, providedYangModels, providedKnowledgeGraph) {
  // Use provided models or load defaults
  const { yangModels: defaultYang, kg: defaultKg } = loadConstraints();
  const yangToUse = providedYangModels || defaultYang;
  const kgToUse = providedKnowledgeGraph || defaultKg;

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
  const client = getOpenAIClient();
  const prompt = `Judge if this A2UI blueprint is valid against YANG models: ${JSON.stringify(yangToUse)}. Knowledge Graph: ${JSON.stringify(kgToUse)}. Blueprint: ${JSON.stringify(blueprint)}. Respond with 'approved' or 'rejected' and reason.`;

  const response = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  const result = response.choices[0].message.content;
  return result.toLowerCase().includes('approved');
}

module.exports = { judgeBlueprint };