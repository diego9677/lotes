import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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
  const [tasas, setTasas] = useState(null)
  const [tiposPago, setTiposPagos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useState({ id_tipo_pago: null, id_tasa: null, period: null })
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
    const { id_tipo_pago: idTipoPago, id_tasa: idTasa, period } = params
    const total = lote.precio
    let capitalVivo = lote.precio
    const result = []
    const tasa = tasas.find(t => t.value === idTasa)
    console.log(tasa)
    if (idTipoPago === 2) {
      for (let i = 0; i <= period; i++) {
        const interes = (total * tasa.interes) / 100
        const cuota = (total / period)
        const amortizacion = cuota - interes
        capitalVivo = capitalVivo - amortizacion
        result.push({ cuota, interes, amortizacion, capitalVivo })
      }
      console.log(result)
    } else {
      //
    }
  }

  if (loading) {
    return (
      <div>Loading...!</div>
    )
  }

  return (
    <div className='flex flex-col items-center h-screen py-5'>
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
        <button type='button' className='p-2 rounded-md outline-none text-white bg-blue-600 text-sm font-semibold flex items-center justify-center h-10 w-20' onClick={generatePlanPago}>
          Generar
        </button>
      </div>
    </div>
  )
}
