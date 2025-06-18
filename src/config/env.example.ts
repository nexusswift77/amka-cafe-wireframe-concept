// Example environment configuration
// Copy this file to create your own environment setup

// Create a .env.local file in the root directory with these variables:
/*
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
*/

// The Supabase client will automatically use these environment variables
// If not set, it will fall back to the CAFE_AMKA project values

export const ENV_EXAMPLE = {
  VITE_SUPABASE_URL: 'https://your-project-id.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'your_supabase_anon_key_here'
}; 