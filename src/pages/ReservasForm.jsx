import { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createReserva, getAllReservaEstado, getClientByCi } from '../services/reserva'
import { getLoteById } from '../services/lotes'
import Select from '../components/Select'

const schema = yup.object({
  ci: yup.string().required('Este campo es requerido'),
  nombres: yup.string().required('Este campo es requerido'),
  apellidos: yup.string().required('Este campo es requerido'),
  monto: yup.number()
    .typeError('El valor debe ser numerico')
    .test('maxDigitsAfterDecimal', 'El numero debe tener como máximo 2 digitos', (number) => Number.isInteger(number * (10 ** 2))),
  id_reserva_estado: yup.number().typeError('El valor debe ser numerico').required('Este campo es requerido')
})

export default function ReservasForm () {
  const [lote, setLote] = useState(null)
  const [reserva, setReserva] = useState(null)
  const [reservasEstado, setReservasEstado] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingButton, setLoadingButton] = useState(false)
  const { id_lote: idLote } = useParams()
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, getValues, trigger } = useForm({ resolver: yupResolver(schema) })
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getLoteById(parseInt(idLote)), getAllReservaEstado()])
      .then(([data, reservasEstado]) => {
        const { id_lote: idLote, manzano, precio, titulo, reserva } = data
        setLote({ id_lote: idLote, manzano, precio, titulo })
        if (reserva.length > 0) {
          const reservaDb = reserva[0]
          setReserva(reservaDb)
          setValue('ci', reservaDb.persona.ci)
          setValue('nombres', reservaDb.persona.nombres)
          setValue('apellidos', reservaDb.persona.apellidos)
          setValue('monto', reservaDb.monto)
          setValue('id_reserva_estado', reservaDb.reserva_estado.at(-1).id_reserva_estado)
        }
        setReservasEstado(reservasEstado.map(r => ({ value: r.id_reserva_estado, label: r.titulo })))
      })
      .finally(() => setLoading(false))
  }, [idLote])

  const onSubmit = async (data) => {
    await createReserva({ ...data, id_lote: parseInt(idLote) })
    navigate('/reservas')
  }

  // const onRemove = () => {
  //   console.log(idLote)
  // }

  const searchClient = async () => {
    setLoadingButton(true)
    const ci = getValues('ci')
    const { nombres, apellidos } = await getClientByCi(ci)
    setValue('nombres', nombres)
    setValue('apellidos', apellidos)
    setLoadingButton(false)
  }

  const handleSelect = async (value) => {
    setValue('id_reserva_estado', value)
    await trigger('id_reserva_estado')
  }

  if (loading) {
    return (
      <div>Loading...!</div>
    )
  }

  return (
    <div className='flex flex-col items-center h-screen py-5'>
      <div className='w-1/2 border border-gray-300 rounded-md p-2 flex items-center my-5'>
        <div className='flex-1 flex flex-col'>
          <p className='text-sm font-light text-gray-500'>{lote.id_lote}</p>
          <h6 className='text-lg font-semibold text-gray-700'>{lote.titulo}</h6>
          <p className='text-sm font-normal text-gray-900'>{lote.manzano.titulo}</p>
        </div>
        <div className='w-40 justify-center'>
          <p className='text-normal font-medium text-gray-800'>{lote.precio} Bs</p>
        </div>
      </div>
      <form className='flex flex-col gap-2 w-1/2' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex justify-between'>
          <Link to='/reservas' className='p-2 text-red-500 hover:text-red-400'>
            <i className='las la-undo-alt la-lg' />
          </Link>
          <h5 className='text-xl font-bold text-gray-700'>Reserva</h5>
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='id_ci' className='text-sm text-gray-900 font-medium'>CI</label>
          <div className='flex gap-2'>
            <input
              id='id_ci'
              type='text'
              className='flex-1 text-sm p-2 outline-none border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:border-blue-600'
              {...register('ci')}
            />
            <button type='button' className='p-1 bg-blue-600 rounded-md text-white' onClick={searchClient}>
              {loadingButton ? <i className='las la-spinner la-lg animate-spin' /> : <i className='las la-search la-lg' />}
            </button>
          </div>
          <p className='text-red-600 text-xs font-normal'>{errors.ci?.message}</p>
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='id_title' className='text-sm text-gray-900 font-medium'>Nombres</label>
          <input
            id='id_title'
            type='text'
            className='text-sm p-2 outline-none border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:border-blue-600'
            {...register('nombres')}
          />
          <p className='text-red-600 text-xs font-normal'>{errors.nombres?.message}</p>
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='id_apellidos' className='text-sm text-gray-900 font-medium'>Apellidos</label>
          <input
            id='id_apellidos'
            type='text'
            step={0.1}
            className='text-sm p-2 outline-none border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:border-blue-600'
            {...register('apellidos')}
          />
          <p className='text-red-600 text-xs font-normal'>{errors.apellidos?.message}</p>
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='id_monto' className='text-sm text-gray-900 font-medium'>Monto</label>
          <input
            id='id_monto'
            type='number'
            step={0.1}
            className='text-sm p-2 outline-none border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:border-blue-600'
            {...register('monto')}
          />
          <p className='text-red-600 text-xs font-normal'>{errors.monto?.message}</p>
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='id_title' className='text-sm text-gray-900 font-medium'>Estado de la reserva</label>
          <Select name='manzano' value={getValues('id_reserva_estado')} options={reservasEstado} onChange={handleSelect} />
          <p className='text-red-600 text-xs font-normal'>{errors.id_reserva_estado?.message}</p>
        </div>
        <div className='flex gap-2 items-center'>
          {/* {idLote && (
            <div className='flex-1'>
              <BtnDelete text='Eliminar' onClick={onRemove} msg={`¿Esta seguro que desea eliminar el lote con el id: ${idLote}?`} />
            </div>
          )} */}
          {!reserva &&
            <button className='flex-1 p-2 rounded-md outline-none text-white bg-blue-600 text-sm font-semibold flex items-center justify-center'>
              {isSubmitting ? <i className='las la-circle-notch la-lg animate-spin' /> : 'Guardar'}
            </button>}
        </div>
      </form>
    </div>
  )
}
