import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const distDir = path.join(__dirname, 'dist');
const indexHtml = path.join(__dirname, 'index.html');

app.disable('x-powered-by');

// Serve static assets
app.use(express.static(__dirname, { index: false }));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(indexHtml);
});

const port = process.env.PORT ? Number(process.env.PORT) : 80;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`Express static SPA listening on http://${host}:${port}`);
});

