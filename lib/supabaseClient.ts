import { createClient } from '@supabase/supabase-js'

// ضع بياناتك هنا
const supabaseUrl = 'https://aohnxdklemtxoyctzrdg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvaG54ZGtsZW10eG95Y3R6cmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxOTA2MjEsImV4cCI6MjA4Mjc2NjYyMX0.-8mZUC6l9uaW6ydfZEOFyl6kIzAW9Mer8MM17wSMdR4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


// const supabaseUrl = !@#music-appmusic-app!@#