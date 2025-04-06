/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_IS_PRODUCTION: string;
  readonly VITE_PRODUCTION_BASE: string;
  readonly VITE_DEVELOPMENT_BASE: string;
  // add other environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
