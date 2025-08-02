import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "dist", // Folder output
    sourcemap: false, // Nonaktifkan sourcemap untuk build produksi
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Pisahkan vendor dependencies ke file tersendiri
            return "vendor";
          }
        },
      },
    },
  },
  server: {
    host: "0.0.0.0", // Agar dapat diakses di jaringan lokal
    port: 3000, // Port pengembangan
    open: true, // Buka browser otomatis
  },
  base: "/", // Pastikan path base sesuai (ubah jika dihosting di subdirektori)
});
