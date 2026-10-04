import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qzccppeyjjncjwztnjuj.supabase.co'
const supabaseKey = "sb_publishable_f3m-X8prh_THrSkOWcWfiA_GeiXsNin"

export const supabase = createClient(supabaseUrl, supabaseKey)