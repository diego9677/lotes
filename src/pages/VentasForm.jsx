import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Select from '../components/Select'
import { getLoteById } from '../services/lotes'
import { getAllTasa, getAllTipoPago } from '../services/ventas'
// import Select from '../components/Select'
const options = [
  { value: 48, label: '4 años' },
  { value: 60, label: '5 años' },
  { value: 74, label: '7 años' },
  { value: 120, label: '10 años' }
]

export default function VentasForm () {
  const [lote, setLote] = useState(null)
  const [planPago, setPlanPago] = useState([])
  const [tasas, setTasas] = useState(null)
  const [tiposPago, setTiposPagos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useState({ id_tipo_pago: null, id_tasa: null, period: null, day: 10 })
  const { id_lote: idLote } = useParams()
  // const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getLoteById(parseInt(idLote)), getAllTipoPago(), getAllTasa()])
      .then(([lote, tiposPago, tasas]) => {
        console.log(tasas)
        setLote(lote)
        setTiposPagos(tiposPago.map(t => ({ value: t.id_tipo_pago, label: t.titulo })))
        setTasas(tasas.map(t => ({ value: t.id_tasa, label: `Interes: ${t.interes}% - Mora: ${t.mora}%`, interes: t.interes, mora: t.mora })))
      })
      .finally(() => setLoading(false))
  }, [idLote])

  const generatePlanPago = () => {
    const { id_tipo_pago: idTipoPago, id_tasa: idTasa, period, day } = params
    const total = lote.precio
    let capitalVivo = total
    const result = []
    const tasa = tasas.find(t => t.value === idTasa)
    const tasaMensual = tasa ? tasa.interes / 12 : null
    const fecha = new Date()

    if (idTipoPago === 2) {
      for (let i = 0; i < period; i++) {
        const interes = (total * tasaMensual) / 100
        const cuota = (total / period) + interes
        const amortizacion = cuota - interes
        fecha.setMonth(fecha.getMonth() + 1)
        fecha.setDate(day)
        capitalVivo = capitalVivo - amortizacion
        const fechaStr = fecha.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })
        result.push({ fecha: fechaStr, cuota: Math.round(cuota * 10) / 10, interes: Math.round(interes * 10) / 10, amortizacion: Math.round(amortizacion * 10) / 10, capitalVivo: Math.round(capitalVivo * 10) / 10 })
      }
    } else {
      const cuota = total
      const interes = 0
      const amortizacion = 0
      const capitalVivo = total
      const fechaStr = fecha.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })
      result.push({ cuota, interes, amortizacion, capitalVivo, fecha: fechaStr })
    }
    setPlanPago(result)
  }

  if (loading) {
    return (
      <div>Loading...!</div>
    )
  }

  return (
    <div className='flex flex-col items-center h-screen py-5'>
      <h5 className='text-xl text-gray-800 font-semibold mb-3'>Registrar Venta</h5>
      <div className='w-3/4 border border-gray-300 rounded-md p-2 flex items-center my-5'>
        <div className='flex-1 flex flex-col'>
          <p className='text-sm font-light text-gray-500'>{lote.id_lote}</p>
          <h6 className='text-lg font-semibold text-gray-700'>{lote.titulo}</h6>
          <p className='text-sm font-normal text-gray-900'>{lote.manzano.titulo}</p>
        </div>
        <div className='w-40 justify-center'>
          <p className='text-normal font-medium text-gray-800'>{lote.precio} Bs</p>
        </div>
      </div>
      <div className='flex w-3/4 gap-2 items-end'>
        <div className='flex-1 flex flex-col gap-1'>
          <label htmlFor='id_title' className='text-sm text-gray-900 font-medium'>Tipo de pago</label>
          <Select name='manzano' value={params.id_tipo_pago} options={tiposPago} onChange={(value) => setParams(val => ({ ...val, id_tipo_pago: value }))} />
        </div>
        {params.id_tipo_pago && params.id_tipo_pago === 2 &&
          <div className='flex-1 flex flex-col gap-1'>
            <label htmlFor='id_title' className='text-sm text-gray-900 font-medium'>Tasa de interes</label>
            <Select name='manzano' value={params.id_tasa} options={tasas} onChange={(value) => setParams(val => ({ ...val, id_tasa: value }))} />
          </div>}
        {params.id_tipo_pago && params.id_tipo_pago === 2 &&
          <div className='flex-1 flex flex-col gap-1'>
            <label htmlFor='id_title' className='text-sm text-gray-900 font-medium'>Periodo</label>
            <Select name='manzano' value={params.period} options={options} onChange={(value) => setParams(val => ({ ...val, period: value }))} />
          </div>}
        {params.id_tipo_pago && params.id_tipo_pago === 2 &&
          <div className='flex flex-col gap-1'>
            <label htmlFor='id_dia_mes' className='text-sm text-gray-900 font-medium'>Dia</label>
            <input
              id='id_dia_mes'
              type='number'
              min={1}
              max={25}
              value={params.day}
              className='text-sm p-2 outline-none border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:border-blue-600'
              onChange={(e) => setParams(val => ({ ...val, day: e.target.value }))}
            />
          </div>}
        <button type='button' className='p-2 rounded-md outline-none text-white bg-blue-600 text-sm font-semibold flex items-center justify-center h-10 w-20' onClick={generatePlanPago}>
          Generar
        </button>
      </div>
      <div className='w-3/4 flex flex-col my-5 h-[400px] overflow-auto'>
        <h5 className='text-xl text-gray-800 font-semibold mb-3'>Plan de pago</h5>
        <table className='min-w-max w-full table-auto'>
          <thead>
            <tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
              <th className='py-3 px-6 text-left'>#</th>
              <th className='py-3 px-6 text-left'>Cuota</th>
              <th className='py-3 px-6 text-left'>Interes</th>
              <th className='py-3 px-6 text-left'>Amortización</th>
              <th className='py-3 px-6 text-left'>Capital</th>
              <th className='py-3 px-6 text-left'>Fecha</th>
            </tr>
          </thead>
          <tbody className='text-gray-600 text-xs font-normal'>
            {planPago.map((p, i) => (
              <tr key={i} className='border-b border-gray-200'>
                <td className='py-3 px-6 text-left whitespace-nowrap'>{i + 1}</td>
                <td className='py-3 px-6 text-left whitespace-nowrap'>{p.cuota}</td>
                <td className='py-3 px-6 text-left whitespace-nowrap'>{p.interes}</td>
                <td className='py-3 px-6 text-left whitespace-nowrap'>{p.amortizacion}</td>
                <td className='py-3 px-6 text-left whitespace-nowrap'>{p.capitalVivo}</td>
                <td className='py-3 px-6 text-left whitespace-nowrap'>{p.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='w-3/4 flex justify-end gap-2'>
        <Link className='p-2 rounded-md outline-none text-white bg-red-600 text-sm font-semibold flex items-center justify-center h-10 w-20' to='/ventas'>
          Cancelar
        </Link>
        <button type='button' className='p-2 rounded-md outline-none text-white bg-blue-600 text-sm font-semibold flex items-center justify-center h-10 w-20' onClick={generatePlanPago}>
          Guardar
        </button>
      </div>
    </div>
  )
}
