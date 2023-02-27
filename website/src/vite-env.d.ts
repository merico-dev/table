/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_WEBSITE_BASE_URL: string;
  readonly VITE_WEBSITE_LOGO_URL_ZH: string;
  readonly VITE_WEBSITE_LOGO_URL_EN: string;
  readonly VITE_WEBSITE_LOGO_JUMP_URL: string;
  readonly VITE_WEBSITE_FAVICON_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
