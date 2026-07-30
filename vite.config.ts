import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const workspaceRoot = process.env.PNPM_WORKSPACE_DIR || path.resolve(__dirname, '../..');
const TARGET_DIST = path.join(workspaceRoot, 'wp-content/plugins/xophz-thoth-reader/public/dist');

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 8089,
      host: '0.0.0.0',
      strictPort: true,
      cors: true,
      allowedHosts: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      outDir: TARGET_DIST,
      emptyOutDir: true,
    },
  };
});
