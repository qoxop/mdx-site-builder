import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import myPlugin from './libs/generator.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    myPlugin(),
    reactRefresh()
  ],
  resolve: {
    alias: [
      {find: /^@builtins\//, replacement: '/app/builtins/'}
    ]
     
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  }
})
