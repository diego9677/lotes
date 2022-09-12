import clsx from 'clsx'
import { Link, useLocation } from 'react-router-dom'

function CustomNavLink ({ to, children }) {
  const location = useLocation()
  const isActive = location.pathname.includes(to)

  return (
    <div className={clsx('px-2', isActive && 'text-blue-600')}>
      <Link to={to}>{children}</Link>
    </div>
  )
}

export default function MainLayout ({ children }) {
  return (
    <div>
      <nav className='flex justify-between items-center h-14 border-b px-10'>
        <div className='w-11 h-11 rounded-full bg-gray-300 flex items-center justify-center'>
          B
        </div>
        <div className='flex items-center gap-2 divide-x divide-gray-300 divide-dashed'>
          <CustomNavLink to='/lotes'>Lotes</CustomNavLink>
          <CustomNavLink to='/ventas'>Ventas</CustomNavLink>
          <CustomNavLink to='/reservas'>Reservas</CustomNavLink>
        </div>
      </nav>
      <div className='px-10'>
        {children}
      </div>
    </div>
  )
}
