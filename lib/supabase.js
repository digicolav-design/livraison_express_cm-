import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wipiikecrkputwytotwu.supabase.co'
const supabaseKey = 'sb_publishable_gpIFxDEw2Le1DBC-w9j8DQ_ObXzEHkW'

export const supabase = createClient(supabaseUrl, supabaseKey)
