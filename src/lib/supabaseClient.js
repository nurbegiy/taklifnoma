import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase environment variables are missing. Copy .env.example to .env and fill in your project values.'
  );
}

// `createClient` throws synchronously (not a React error) if the URL is
// missing or malformed. If that happens during module load, it would crash
// the entire app before React ever renders anything — a blank white page
// with no way to recover. Guarding it here means a misconfigured deploy
// degrades to "requests fail" instead of "site never loads at all".
let client;
try {
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
} catch (err) {
  console.error('Failed to initialize Supabase client:', err);
  const brokenMethod = () => Promise.resolve({ data: null, error: err });
  client = {
    auth: {
      getSession: brokenMethod,
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signInWithPassword: brokenMethod,
      signOut: brokenMethod,
    },
    from() {
      return {
        select: brokenMethod,
        insert: brokenMethod,
        update: brokenMethod,
        delete: brokenMethod,
        eq: () => this,
        single: brokenMethod,
      };
    },
  };
}

export const supabase = client;
