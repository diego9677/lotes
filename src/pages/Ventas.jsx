import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllLotes } from '../services/lotes'

const extractStatus = (lote) => {
  const { reserva } = lote

  if (reserva.length > 0) {
    const estados = reserva[0].reserva_estado.map(r => (r.titulo))
    return estados.join(',')
  }

  return '--'
}

export default function Ventas () {
  const [filter, setFilter] = useState('')
  const [lotes, setLotes] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllLotes()
      .then((data) => {
        setLotes(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const filterList = () => lotes.filter(l => l.titulo.toLowerCase().includes(filter.toLocaleLowerCase()))

  if (loading) return <div>loading...!</div>

  return (
    <div className='flex flex-col py-5 gap-4'>
      <div className='flex items-center justify-end'>
        {/* <Link to='/lotes/new' className='p-2 bg-blue-600 text-white rounded-md outline-none hover:bg-opacity-80'>
          <i className='las la-plus la-lg' />
        </Link> */}
        <input
          type='text'
          placeholder='Buscar...'
          className='p-2 border border-gray-300 rounded-md w-1/4 outline-none placeholder:text-gray-500 text-gray-900 focus:border-blue-600'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      {/* table */}
      <div className='w-full bg-white border border-gray-300 shadow-md rounded-md'>
        <table className='min-w-max w-full table-auto'>
          <thead>
            <tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
              <th className='py-3 px-6 text-left'>Id</th>
              <th className='py-3 px-6 text-left'>Título</th>
              <th className='py-3 px-6 text-left'>Precio</th>
              <th className='py-3 px-6 text-left'>Manzano</th>
              <th className='py-3 px-6 text-left'>Estados</th>
              <th className='py-3 px-6 text-left'>Acciones</th>
            </tr>
          </thead>
          <tbody className='text-gray-600 text-sm font-normal'>
            {filterList().map(l => (
              <tr key={l.id_lote} className='border-b border-gray-200'>
                <td className='py-3 px-6 text-left whitespace-nowrap'>{l.id_lote}</td>
                <td className='py-3 px-6 text-left whitespace-nowrap'>{l.titulo}</td>
                <td className='py-3 px-6 text-left whitespace-nowrap'>{l.precio} Bs</td>
                <td className='py-3 px-6 text-left whitespace-nowrap'>{l.manzano.titulo}</td>
                <td className='py-3 px-6 text-left whitespace-nowrap'>{extractStatus(l)}</td>
                <td className='py-3 px-6 text-left whitespace-nowrap flex items-center gap-2'>
                  <Link to={`/ventas/${l.id_lote}`} className='p-2 bg-green-600 text-white rounded-md hover:bg-opacity-80'>
                    <i className='las la-arrow-alt-circle-right la-lg' />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
