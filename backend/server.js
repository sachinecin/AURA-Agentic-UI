require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateBlueprint } = require('../agents/generator');
const { judgeBlueprint } = require('../agents/discriminator');
const redis = require('redis');
const fs = require('fs');
const promClient = require('prom-client');

const app = express();
app.use(cors());
app.use(express.json());

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});
register.registerMetric(httpRequestDuration);

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode });
  });
  next();
});

const redisClient = redis.createClient({ host: 'redis', port: 6379 });
redisClient.connect();

const yangModels = JSON.parse(fs.readFileSync('./yang-models.json', 'utf8'));
const knowledgeGraph = JSON.parse(fs.readFileSync('./kg.json', 'utf8'));

app.get('/', (req, res) => {
  res.send('AURA Backend Running');
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.post('/generate-ui', async (req, res) => {
  const { userIntent, telemetry } = req.body;

  const cacheKey = `blueprint:${userIntent}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return res.json({ success: true, blueprint: JSON.parse(cached) });
  }

  try {
    // Generator
    const blueprint = await generateBlueprint(userIntent, telemetry);

    // Discriminator
    const approved = await judgeBlueprint(blueprint, yangModels, knowledgeGraph);

    if (approved) {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(blueprint)); // Cache for 1 hour
      res.json({ success: true, blueprint });
    } else {
      res.json({ success: false, message: 'Blueprint rejected by discriminator' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AURA Backend listening on port ${PORT}`);
});