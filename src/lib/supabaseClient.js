import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fyjgjdvntyqnkzcoygat.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5amdqZHZudHlxbmt6Y295Z2F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzODkyNzEsImV4cCI6MjA3MTk2NTI3MX0.0aUiURsjHRRYKWi1iiGycyzojSC7PVxsBSTQ42W_-qA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


