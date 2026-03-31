import express from 'express';
import path from 'path';
import pino from 'pino';
import pinoHttp from 'pino-http';

const logger = pino({ name: 'hw1' });
const app = express();
const parsed = parseInt(process.env.PORT || '3000', 10);
if (Number.isNaN(parsed)) {
  logger.warn({ raw: process.env.PORT }, 'Invalid PORT env var, falling back to 3000');
}
const port = Number.isNaN(parsed) ? 3000 : parsed;

app.use(pinoHttp({ logger }));

app.use(express.static(path.join(__dirname, '..', 'public')));

interface GreetingResponse {
  message: string;
}

app.get('/api/greeting', (_req, res) => {
  const body: GreetingResponse = { message: 'Hello, World!' };
  res.json(body);
});

app.listen(port, () => {
  logger.info({ port }, 'Server listening');
});
