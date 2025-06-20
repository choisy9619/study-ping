// Environment Configuration
export const env = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'StudyPing',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  auth: {
    skipEmailConfirmation: import.meta.env.VITE_SKIP_EMAIL_CONFIRMATION === 'true',
  },
} as const;

// Validation function to ensure all required env vars are present
export function validateEnv() {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] as const;

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` + 'Please check your .env.local file.'
    );
  }
}

// Development helper
export function logEnvStatus() {
  if (import.meta.env.DEV) {
    console.log('🔧 Environment Status:');
    console.log(`  App: ${env.app.name} v${env.app.version}`);
    console.log(`  Supabase URL: ${env.supabase.url ? '✅ Set' : '❌ Missing'}`);
    console.log(`  Supabase Key: ${env.supabase.anonKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`  Skip Email Confirmation: ${env.auth.skipEmailConfirmation ? '✅ Enabled' : '❌ Disabled'}`);
  }
}
