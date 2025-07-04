// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://puoumawrkizeimgrulox.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1b3VtYXdya2l6ZWltZ3J1bG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDYzMjMsImV4cCI6MjA2NTU4MjMyM30.7TwJdhkqGic20QD9F6-maFG0J9wBoIBnOi6GHRNjRwc";

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  console.error('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
}

// Log which configuration is being used (for development)
if (import.meta.env.DEV) {
  const isUsingEnvVars = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
  console.log(`Supabase Config: ${isUsingEnvVars ? 'Using environment variables' : 'Using fallback values'}`);
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);