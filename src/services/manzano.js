import { supabase } from '../lib/supabase'

export async function getAllManzanos () {
  const { data } = await supabase.from('manzano').select('*').order('id_manzano', { ascending: true })

  return data
}
