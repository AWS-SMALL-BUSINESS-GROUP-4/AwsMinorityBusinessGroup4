import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Optional: alias the runtimeConfig to the browser version if needed
      './runtimeConfig': 'aws-amplify/lib/common/runtimeConfig.browser'
    }
  },
  define: {
    global: 'window',
    'process.env': {}
  },
  optimizeDeps: {
    include: ['aws-amplify', 'aws-amplify/auth']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
});
