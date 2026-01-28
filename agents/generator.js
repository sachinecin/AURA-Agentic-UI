// Generator Agent: Drafts A2UI-compliant JSON blueprints

const OpenAI = require('openai');

let openai;

function getOpenAIClient() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

async function generateBlueprint(userIntent, telemetry) {
  const client = getOpenAIClient();
  const prompt = `Generate an A2UI-compliant JSON blueprint for the user intent: ${userIntent}. Telemetry: ${JSON.stringify(telemetry)}`;

  const response = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  const blueprint = JSON.parse(response.choices[0].message.content);
  return blueprint;
}

module.exports = { generateBlueprint };