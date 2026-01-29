import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from './assets/logo.png'
import './Home.css'

export function Home() {

  return (  
    <>

    </>
  )
}

export function Header() {
  return (
    <header>
      <img src={logo} alt="Logo de Dataflix" />
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
