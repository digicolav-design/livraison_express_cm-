import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wipiikecrkputwytotwu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcGlpa2VjcmtwdXR3eXRvdHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMTk4MTksImV4cCI6MjA5MTc5NTgxOX0.dw1n1aMs-NpBi3zOdGM5J58xmcpDO2Uum8KSKg1HXbw'

export const supabase = createClient(supabaseUrl, supabaseKey)
