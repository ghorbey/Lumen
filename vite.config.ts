import type { UserConfig } from 'vite';
import path from 'path';
import checker from 'vite-plugin-checker';

const config: UserConfig = {
  root: 'src/',
  base: '/systems/lumen/',
  publicDir: path.resolve(__dirname, 'public'),
  server: {
    port: 30001,
    open: true,
    proxy: {
      '^(?!/systems/lumen)': 'http://localhost:30000/',
      '/socket.io': {
        target: 'ws://localhost:30000',
        ws: true
      }
    }
  },
  resolve: {
    alias: [
      {
        find: './runtimeConfig',
        replacement: './runtimeConfig.browser' // thanks @aws-sdk
      }
    ]
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      name: 'lumen',
      entry: path.resolve(__dirname, 'src/lumen.ts'),
      formats: ['es'],
      fileName: 'lumen'
    }
  },
  plugins: [
    checker({
      typescript: true
    })
  ]
};

export default config;
