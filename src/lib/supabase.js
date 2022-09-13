import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ukafcvinjiewpyqovioq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrYWZjdmluamlld3B5cW92aW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjMwOTExNjksImV4cCI6MTk3ODY2NzE2OX0.LVsfnTmq-4l-fMeUinYJXCsQN3F7tHL-iVzYX0Y0jNg'

export const supabase = createClient(supabaseUrl, supabaseKey)
