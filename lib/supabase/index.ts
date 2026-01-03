// Re-export the original supabase client for backwards compatibility
// This allows existing code using `import { supabase } from '@/lib/supabase'` to keep working
export { supabase, handleSupabaseError } from '../supabase';

// Export new SSR-aware clients
export { createClient as createBrowserClient } from './client';
export { createClient as createServerClient } from './server';
export { updateSession } from './middleware';
