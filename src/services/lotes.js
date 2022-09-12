import { supabase } from '../lib/supabase'

export async function getAllLotes () {
  const { data, error } = await supabase.from('lote').select('id_lote,titulo,precio,manzano(id_manzano,titulo),coordenadas(latitud,longitud)').order('id_lote', { ascending: true })

  if (error) {
    throw error
  }

  return data
}

export async function getLoteById (id) {
  const { data } = await supabase.from('lote').select('id_lote,titulo,precio,manzano(id_manzano,titulo),coordenadas(latitud,longitud)').eq('id_lote', id)

  return data.length > 0 ? data[0] : undefined
}

export async function createLote ({ lote, coords }) {
  const { data } = await supabase.from('lote').insert([lote])

  const loteDb = data.length > 0 ? data[0] : null

  if (loteDb) {
    const newCoords = coords.map(c => ({ latitud: parseFloat(c.latitud), longitud: parseFloat(c.longitud), id_lote: loteDb.id_lote }))
    await supabase.from('coordenadas').insert(newCoords)
  }

  return data
}

export async function updateLote ({ id, lote, coords }) {
  const { data } = await supabase.from('lote').update(lote).eq('id_lote', id)

  const loteDb = data.length > 0 ? data[0] : null

  if (loteDb) {
    await supabase.from('coordenadas').delete().eq('id_lote', loteDb.id_lote)
    const newCoords = coords.map(c => ({ latitud: parseFloat(c.latitud), longitud: parseFloat(c.longitud), id_lote: loteDb.id_lote }))
    await supabase.from('coordenadas').insert(newCoords)
  }

  return data
}

export async function deleteLote (id) {
  const { data } = await supabase.from('lote').delete().eq('id_lote', id)

  return data
}
