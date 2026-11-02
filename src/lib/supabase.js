
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check Supabase configuration
export const isSupabaseConfigured = Boolean(url && anonKey)

// Initialize Supabase client
export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null

// Existing Supabase Storage bucket
export const IMAGE_BUCKET = 'listing-images'
