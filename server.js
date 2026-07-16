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

  const url = req.originalUrl || '';

  // If it's a browser navigation, always serve SPA index.html.
  if (isHtmlNavigation) {
    return res.sendFile(indexHtml);
  }

  // For module/script/style requests, avoid MIME issues by not serving index.html.
  // But let express.static handle real existing assets.
  if (
    url.match(/\.(?:js|mjs|cjs|css|map|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|eot)$/i)
  ) {
    return next();
  }

  // For anything else (e.g. direct /path routes), serve SPA entry.
  return res.sendFile(indexHtml);
});


const port = process.env.PORT ? Number(process.env.PORT) : 80;


const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`Express static SPA listening on http://${host}:${port}`);
});

