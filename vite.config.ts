import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 500,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - separate large dependencies
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
          'router': ['wouter'],
          'query': ['@tanstack/react-query'],
          'ui-core': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-popover'
          ],
          'ui-forms': [
            '@radix-ui/react-label',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-slider',
            '@radix-ui/react-switch'
          ],
          'icons': ['lucide-react'],
          'charts': ['recharts'],
          'form': ['react-hook-form', '@hookform/resolvers', 'zod']
        },
        // Optimize chunk names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Enable source maps for production debugging (can disable later)
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
    // Report compressed size
    reportCompressedSize: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
