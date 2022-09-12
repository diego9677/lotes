import { Link } from 'react-router-dom'

export default function MainLayout ({ children }) {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to='/'>Principal</Link>
          </li>
          <li>
            <Link to='/ventas'>Ventas</Link>
          </li>
          <li>
            <Link to='/reservas'>Reservas</Link>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  )
}
