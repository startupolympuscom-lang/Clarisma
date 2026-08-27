// Local dev/preview bootstrap only. Vercel deploys `api/index.ts`, which
// imports the plain `app` from `server.ts` and never touches this file - so
// `vite` (a devDependency) and `app.listen` can never leak into the
// serverless function bundle, no matter how Vercel's project settings are
// configured.
import path from 'path';
import express from 'express';
import { app } from './server';

const PORT = 3000;

// `server.ts` already fires off initDB() itself on import (fire-and-forget,
// same as the deployed function does) - no need to repeat it here.
async function startDevServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startDevServer();
