import http from 'node:http';
import pino from 'pino';

const logger = pino({ name: 'hw1' });

const greetings: string[] = [
  'Hello, World!',
  'Hey there!',
  'Greetings, traveler!',
  'Hi friend!',
  'Welcome!',
  'Good day!',
  'Howdy!',
  'Salutations!',
];

function renderHtml(serverTime: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello World Test App</title>
  <style>
    :root {
      --bg: #1a1512;
      --surface: #2a2320;
      --surface2: #3a3230;
      --border: #4a3f3a;
      --text: #f0e6d8;
      --text-dim: #a89888;
      --accent: #e8a04c;
      --accent-hover: #f0b060;
      --success: #7cb87c;
      --error: #d96858;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .container {
      max-width: 36rem;
      width: 100%;
    }

    h1 {
      font-size: 2rem;
      color: var(--accent);
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    p.subtitle {
      color: var(--text-dim);
      font-size: 1rem;
      margin-bottom: 2rem;
    }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      padding: 1.25rem;
      margin-bottom: 1rem;
    }

    .card h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .card p {
      color: var(--text-dim);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .time-display {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      font-variant-numeric: tabular-nums;
      color: var(--text-dim);
    }

    .btn {
      display: inline-block;
      background: var(--accent);
      color: var(--bg);
      border: none;
      border-radius: 0.25rem;
      padding: 0.625rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 1rem;
    }

    .btn:hover {
      background: var(--accent-hover);
    }

    .btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .greeting-output {
      margin-top: 1rem;
      font-size: 1.125rem;
      color: var(--success);
      min-height: 1.5rem;
    }

    .footer {
      margin-top: 2rem;
      color: var(--text-dim);
      font-size: 0.8rem;
      border-top: 1px solid var(--border);
      padding-top: 1rem;
    }

    @media (max-width: 30rem) {
      body {
        padding: 1rem;
      }

      h1 {
        font-size: 1.5rem;
      }

      p.subtitle {
        margin-bottom: 1.25rem;
      }

      .card {
        padding: 1rem;
      }

      .time-display {
        font-size: 1rem;
        margin-bottom: 1rem;
      }

      .btn {
        display: block;
        width: 100%;
        text-align: center;
      }

      .footer {
        margin-top: 1.25rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 data-testid="heading">Hello World</h1>
    <p class="subtitle">A warm, friendly dark theme with ember tones</p>
    <div class="card">
      <h3>Welcome</h3>
      <p>This is a minimal card component styled with warm charcoal backgrounds and cream-colored text. All colors use CSS custom properties for easy theming.</p>
    </div>
    <div class="card">
      <h3>Features</h3>
      <p>Dark background with brown undertones. Amber accent colors for highlights and interactive elements. Links stand out without being harsh.</p>
    </div>
    <div class="time-display" data-testid="time-display" aria-label="Current time">${serverTime}</div>
    <button class="btn" data-testid="greeting-button">Get Started</button>
    <p data-testid="greeting-output" class="greeting-output" aria-live="polite"></p>
    <div class="footer">Built with warm colors and good intentions.</div>
  </div>

  <script>
    (function () {
      var timeEl = document.querySelector('[data-testid="time-display"]');
      var btnEl = document.querySelector('[data-testid="greeting-button"]');
      var greetEl = document.querySelector('[data-testid="greeting-output"]');

      function updateTime() {
        if (timeEl) {
          timeEl.textContent = new Date().toLocaleTimeString();
        }
      }

      updateTime();
      setInterval(updateTime, 1000);

      if (btnEl && greetEl) {
        btnEl.addEventListener('click', function () {
          fetch('/api/greeting')
            .then(function (res) {
              if (!res.ok) throw new Error('Request failed');
              return res.json();
            })
            .then(function (data) {
              greetEl.textContent = data.greeting;
            })
            .catch(function () {
              greetEl.textContent = 'Could not fetch greeting';
            });
        });
      }
    })();
  </script>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    const serverTime = new Date().toLocaleTimeString();
    const html = renderHtml(serverTime);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  if (req.url === '/api/greeting') {
    if (req.method !== 'GET') {
      res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ greeting }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
});

const parsed = parseInt(process.env.PORT || '3000', 10);
const port = Number.isNaN(parsed) ? 3000 : parsed;

if (require.main === module) {
  server.listen(port, () => {
    logger.info({ port }, 'Server listening');
  });
}

module.exports = server;
export default server;
