import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Select from '../components/Select'
import { getAllManzanos } from '../services/manzano'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { createLote, deleteLote, getLoteById, updateLote } from '../services/lotes'
import BtnDelete from '../components/BtnDelete'

// function sleep (ms) {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }

const schema = yup.object({
  titulo: yup.string().required('Este campo es requerido'),
  precio: yup.number()
    .typeError('El valor debe ser numerico')
    .test('maxDigitsAfterDecimal', 'El numero debe tener como máximo 2 digitos', (number) => Number.isInteger(number * (10 ** 2))),
  id_manzano: yup.number().integer().positive().required('Este campo es requerido'),
  coords: yup.array().of(yup.number()).min(3, 'Debe seleccionar 1')
})

export default function LoteForm () {
  const [loading, setLoading] = useState(true)
  const [manzanos, setManzanos] = useState([])
  const [coords, setCoords] = useState([])
  const [point, setPoint] = useState({ latitud: 0, longitud: 0 })
  const [coordsMessage, setCoordsMessage] = useState(null)
  const { handleSubmit, register, getValues, setValue, trigger, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) })
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    getAllManzanos()
      .then(data => setManzanos(data.map(d => ({ value: d.id_manzano, label: d.titulo }))))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (id) {
      getLoteById(parseInt(id))
        .then(data => {
          const { titulo, precio, manzano, coordenadas } = data
          setValue('titulo', titulo)
          setValue('precio', precio)
          setValue('id_manzano', manzano.id_manzano)
          setCoords(coordenadas)
        })
    }
  }, [id])

  const handleSelect = async (value) => {
    setValue('id_manzano', value)
    await trigger('id_manzano')
  }

  const onSubmit = async (data) => {
    if (coords.length >= 3 && coords.length <= 4) {
      if (id) {
        await updateLote({ id, lote: data, coords })
        navigate('/lotes')
      } else {
        await createLote({ lote: data, coords })
        navigate('/lotes')
      }
    } else {
      setCoordsMessage('El lote debete tener 3 o 4 puntos.')
    }
  }

  const onRemove = async () => {
    await deleteLote(id)
    navigate('/lotes')
  }

  const handleCoords = (e) => {
    const { value, name } = e.target
    setPoint(val => ({ ...val, [name]: value }))
  }

  const addPoint = () => {
    setCoords(val => ([...val, point]))
  }

  const removePoint = ({ latitud, longitud }) => {
    const filterList = coords.filter(c => c.latitud !== latitud && c.longitud !== longitud)
    setCoords(filterList)
  }

  if (loading) {
    return <div>loading...!</div>
  }

  return (
    <div className='flex flex-col items-center h-screen py-5'>
      <form className='flex flex-col gap-2 w-1/2' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex justify-between'>
          <Link to='/lotes' className='p-2 text-red-500 hover:text-red-400'>
            <i className='las la-undo-alt la-lg' />
          </Link>
          <h5 className='text-xl font-bold text-gray-700'>{id ? 'Editar' : 'Nuevo'} Lote</h5>
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='id_title' className='text-sm text-gray-900 font-medium'>Título</label>
          <input
            id='id_title'
            type='text'
            className='text-sm p-2 outline-none border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:border-blue-600'
            {...register('titulo')}
          />
          <p className='text-red-600 text-xs font-normal'>{errors.titulo?.message}</p>
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='id_precio' className='text-sm text-gray-900 font-medium'>Precio</label>
          <input
            id='id_precio'
            type='number'
            step={0.1}
            className='text-sm p-2 outline-none border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:border-blue-600'
            {...register('precio')}
          />
          <p className='text-red-600 text-xs font-normal'>{errors.precio?.message}</p>
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='id_title' className='text-sm text-gray-900 font-medium'>Manzano</label>
          <Select name='manzano' value={getValues('id_manzano')} options={manzanos} onChange={handleSelect} />
          <p className='text-red-600 text-xs font-normal'>{errors.id_manzano?.message}</p>
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='id_coords' className='text-sm text-gray-900 font-medium'>Coordenadas</label>
          <div className='max-h-[160px] border rounded-md overflow-auto'>
            {coords.map((c, i) => (
              <div key={i} className='flex justify-between items-center border-b p-2'>
                <p className='text-sm text-gray-900'>{c.latitud}, {c.longitud}</p>
                <button type='button' className='p-0.5 rounded-md bg-red-500 text-white' onClick={() => removePoint(c)}>
                  <i className='las la-times la-md' />
                </button>
              </div>
            ))}
          </div>
          {coordsMessage && <p className='text-red-600 text-xs font-normal'>{coordsMessage}</p>}
          <div className='flex gap-2 items-end'>
            <div className='flex-1 flex flex-col gap-1'>
              <label htmlFor='id_lat' className='text-sm text-gray-900 font-medium'>Latitud</label>
              <input
                id='id_lat'
                type='number'
                name='latitud'
                step={0.01}
                className='text-sm p-2 outline-none border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:border-blue-600'
                value={point.latitud}
                onChange={handleCoords}
              />
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <label htmlFor='id_lng' className='text-sm text-gray-900 font-medium'>Longitud</label>
              <input
                id='id_lng'
                name='longitud'
                type='number'
                step={0.01}
                className='text-sm p-2 outline-none border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:border-blue-600'
                value={point.longitud}
                onChange={handleCoords}
              />
            </div>
            <button type='button' className='p-2 bg-green-600 rounded-md text-sm text-white hover:bg-opacity-80' onClick={addPoint}>
              <i className='las la-plus la-lg' />
            </button>
          </div>
        </div>
        <div className='flex gap-2 items-center'>
          {id && (
            <div className='flex-1'>
              <BtnDelete text='Eliminar' onClick={onRemove} msg={`¿Esta seguro que desea eliminar el lote con el id: ${id}?`} />
            </div>
          )}
          <button className='flex-1 p-2 rounded-md outline-none text-white bg-blue-600 text-sm font-semibold flex items-center justify-center'>
            {isSubmitting ? <i className='las la-circle-notch la-lg animate-spin' /> : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}
