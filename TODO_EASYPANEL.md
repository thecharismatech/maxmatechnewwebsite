# EasyPanel + this repo (React/Vite) - troubleshooting checklist

- [ ] Confirm EasyPanel expects `npm start` (or another command like `npm run dev`).
- [ ] If it expects `npm start`, add a `start` script that runs Vite.
- [ ] Ensure container uses the correct port (Vite default 5173) and open firewall/routing in EasyPanel.
- [ ] Prefer `npm run build` and serve the built `dist/` via a static server if EasyPanel requires production mode.
- [ ] If EasyPanel uses Docker supervisor/pm2, ensure correct command:
  - Dev: `npm run dev -- --host --port <PORT>`
  - Prod: `npm run build` + static serve.
- [ ] Re-run EasyPanel deployment and confirm logs are clean.

