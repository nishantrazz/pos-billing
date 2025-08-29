

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hweyfrjzjibctsbwqmaq.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key is missing. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseKey)
