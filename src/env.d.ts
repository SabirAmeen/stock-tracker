// Type declarations for @ngx-env/builder environment variables.
// Variables prefixed with NG_APP_ from .env are injected at build time.

declare interface Env {
  readonly NODE_ENV: string;
  readonly NG_APP_FIREBASE_API_KEY: string;
  readonly NG_APP_FIREBASE_AUTH_DOMAIN: string;
  readonly NG_APP_FIREBASE_PROJECT_ID: string;
  readonly NG_APP_FIREBASE_STORAGE_BUCKET: string;
  readonly NG_APP_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly NG_APP_FIREBASE_APP_ID: string;
  [key: string]: any;
}

declare interface ImportMeta {
  readonly env: Env;
}
