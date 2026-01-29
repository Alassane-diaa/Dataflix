import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { fetchTrending } from './Fetcher.jsx'
import logo from './assets/logo.png'
import './Home.css'

export function Home() {
  const [trendingMovies, setTrendingMovies] = useState([])
  
  useEffect(() => {
    fetchTrending().then(movies => setTrendingMovies(movies));
  }, []);

  return (  
    <>
      <main>
        <h1>Trending Movies</h1>
        <div className="movies-caroussel">
          {trendingMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img 
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
                alt={movie.title} 
              />
              <h2>{movie.title}</h2>
            </div>
          ))}
        </div>
      </main>
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
