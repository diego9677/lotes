import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import LoteForm from './pages/LoteForm'
import Lotes from './pages/Lotes'
import Reservas from './pages/Reservas'
import ReservasForm from './pages/ReservasForm'
import Ventas from './pages/Ventas'
import VentasForm from './pages/VentasForm'

export default function App () {
  return (
    <MainLayout>
      <Routes>
        {/* lotes section */}
        <Route path='/lotes' element={<Lotes />} />
        <Route path='/lotes/edit/:id' element={<LoteForm />} />
        <Route path='/lotes/new' element={<LoteForm />} />
        <Route path='/ventas' element={<Ventas />} />
        <Route path='/ventas/:id_lote' element={<VentasForm />} />
        <Route path='/reservas' element={<Reservas />} />
        <Route path='/reservas/:id_lote' element={<ReservasForm />} />
        <Route path='/' element={<Navigate to='/lotes' />} />
        <Route path='*' element={<div>Not found</div>} />
      </Routes>
    </MainLayout>
  )
}
