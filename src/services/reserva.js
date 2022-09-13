import { supabase } from '../lib/supabase'

export async function getClientByCi (ci) {
  const { data } = await supabase.from('persona').select('*').eq('ci', ci)

  return data.length > 0 ? data[0] : null
}

export async function createPersona (persona) {
  const { data } = await supabase.from('persona').insert([persona])

  return data.length > 0 ? data[0] : null
}

export async function getAllReservaEstado () {
  const { data } = await supabase.from('reserva_estado').select('*').order('id_reserva_estado', { ascending: true })

  return data
}

export async function createReserva ({ ci, nombres, apellidos, monto, id_reserva_estado: idReservaEstado, id_lote: idLote }) {
  const personaDb = await getClientByCi(ci)
  let idProspecto
  if (personaDb) {
    idProspecto = personaDb.id_persona
  } else {
    const perDb = await createPersona({ ci, nombres, apellidos })
    idProspecto = perDb.id_persona
  }

  const { data } = await supabase.from('reserva').insert([{ monto, id_lote: idLote, id_prospecto: idProspecto }])
  if (data.length > 0) {
    const reservaDb = data[0]
    await supabase.from('reserva_tiene_estado').insert([{ id_reserva: reservaDb.id_reserva, id_reserva_estado: idReservaEstado }])
  }
}
