/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Supabase
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  
  // Razorpay
  readonly VITE_RAZORPAY_KEY_ID: string
  readonly VITE_RAZORPAY_KEY_SECRET: string
  readonly VITE_RAZORPAY_MODE: 'test' | 'live'
  
  // SMS Gateway (MSG91)
  readonly VITE_SMS_AUTH_KEY: string
  readonly VITE_SMS_SENDER_ID: string
  readonly VITE_SMS_ROUTE: string
  readonly VITE_SMS_ENABLED: string
  
  // Backblaze B2
  readonly VITE_B2_KEY_ID: string
  readonly VITE_B2_APPLICATION_KEY: string
  readonly VITE_B2_BUCKET_ID: string
  readonly VITE_B2_BUCKET_NAME: string
  readonly VITE_B2_ENDPOINT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
