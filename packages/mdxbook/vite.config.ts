import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import reactMdxoc from "@qoxop/vite-plugin-react-mdxoc"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactMdxoc(),
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
