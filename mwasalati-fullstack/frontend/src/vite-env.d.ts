/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ALSOQ_BEARER_TOKEN: string;
  readonly VITE_ALSOQ_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
