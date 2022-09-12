import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bvzzbbkiqlahjtryfelv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2enpiYmtpcWxhaGp0cnlmZWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI5MDczOTcsImV4cCI6MTk3ODQ4MzM5N30.lWSXJ10jurUd4SnUQpGSUL8EQQAUx0XZBW_iFyvutLc'

export const supabase = createClient(supabaseUrl, supabaseKey)
