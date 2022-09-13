import { supabase } from '../lib/supabase'

export async function getAllTipoPago () {
  const { data } = await supabase.from('tipo_pago').select('*').order('id_tipo_pago', { ascending: true })

  return data
}

export async function getAllTasa () {
  const { data } = await supabase.from('tasa').select('*').order('id_tasa', { ascending: true })

  return data
}
