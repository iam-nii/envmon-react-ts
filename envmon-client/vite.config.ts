import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      proxy: {
        "/api": {
          target: "http://localhost/pdn1",
          // target: "https://sapr3.lti-gti.ru/pdn1/",
        },
        "/envmon": {
          target: "http://localhost/pdn1/",
          // target: "https://sapr3.lti-gti.ru/pdn1/",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/envmon/, "/envmon"),
        },
      },
    },
    base: env.VITE_IS_PRODUCTIONg
      ? env.VITE_PRODUCTION_BASE
      : env.VITE_DEVELOPMENT_BASE,
    plugins: [react()],
  };
});
