import { NavLink, Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Header() {
  return (
    <header>
      <Link to="/"><img src={logo} alt="Logo de Dataflix" /></Link>
      <nav>
        <button id='search'>Search</button>
        <NavLink to="/" className="nav-item">Home</NavLink>
        <NavLink to="/movies" className="nav-item">Movies</NavLink>
        <NavLink to="/series" className="nav-item">Series</NavLink>
        <NavLink to="/favorites" className="nav-item">My favorites</NavLink>
      </nav>
    </header>
  )
}
