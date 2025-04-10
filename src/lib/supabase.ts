import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY } from '@/app/api/constant';

// Regular client for client-side operations
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-debug-rls': 'true' // Enables RLS debug mode
    }
  }
});

// Admin client with service role key for bypassing RLS
// IMPORTANT: Only use this in server-side code (API routes)
export const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
    },
    db: {
      schema: 'public'
    }
  }
);