import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/MainLayout'

export default function App () {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <MainLayout>
            <div>index</div>
          </MainLayout>
        }
      />
      <Route
        path='/ventas'
        element={
          <MainLayout>
            <div>Ventas</div>
          </MainLayout>
        }
      />
      <Route
        path='/reservas'
        element={
          <MainLayout>
            <div>Reservas</div>
          </MainLayout>
       }
      />
      <Route path='*' element={<div>Not found</div>} />
    </Routes>
  )
}
