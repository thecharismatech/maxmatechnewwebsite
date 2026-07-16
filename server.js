import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const distDir = path.join(__dirname, 'dist');
const indexHtml = path.join(distDir, 'index.html');

app.disable('x-powered-by');

// Serve static assets from the production build
app.use(express.static(distDir, { index: false }));

// SPA fallback:
// Only return index.html for real page navigations.
// For JS/CSS/assets module requests, return 404 so the browser doesn't receive HTML with wrong MIME type.
app.get('*', (req, res, next) => {
  const accept = req.headers.accept || '';
  const isHtmlNavigation = accept.includes('text/html');

  // Explicitly handle only real browser navigations.
  // Everything else should be handled by express.static (404 if missing),
  // to avoid sending index.html as a JS module (wrong MIME type).
  if (!isHtmlNavigation) {
    return next();
  }

  // For any HTML navigation, serve SPA entry.
  return res.sendFile(indexHtml);
});



const port = process.env.PORT ? Number(process.env.PORT) : 80;


const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`Express static SPA listening on http://${host}:${port}`);
});

