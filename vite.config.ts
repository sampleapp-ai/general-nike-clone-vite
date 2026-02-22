import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      {
        name: 'api-routes',
        configureServer(server) {
          // Make non-VITE_ env vars available to server-side code
          Object.assign(process.env, env);
          server.middlewares.use(async (req, res, next) => {
            if (req.url?.startsWith('/api/')) {
              try {
                const apiModule = await import('./server/api');
                await apiModule.handleApiRequest(req, res);
              } catch (error) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal server error' }));
              }
            } else {
              next();
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
