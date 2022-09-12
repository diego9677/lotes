import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import LoteForm from './pages/LoteForm'
import Lotes from './pages/Lotes'
import Reservas from './pages/Reservas'
import Ventas from './pages/Ventas'

export default function App () {
  return (
    <MainLayout>
      <Routes>
        {/* lotes section */}
        <Route path='/lotes' element={<Lotes />} />
        <Route path='/lotes/edit/:id' element={<LoteForm />} />
        <Route path='/lotes/new' element={<LoteForm />} />
        <Route path='/ventas' element={<Ventas />} />
        <Route path='/reservas' element={<Reservas />} />
        <Route path='/' element={<Navigate to='/lotes' />} />
        <Route path='*' element={<div>Not found</div>} />
      </Routes>
    </MainLayout>
  )
}
