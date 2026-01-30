import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { fetchTrending } from './Fetcher.jsx'
import logo from './assets/logo.png'
import './Home.css'

export function Home() {
  const [trendingMovies, setTrendingMovies] = useState([])
  
  useEffect(() => {
    fetchTrending().then(movies => setTrendingMovies(movies));
  }, []);

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const cardRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const gap = 16;

  useEffect(() => {
    const update = () => {
      const el = cardRef.current;
      if (el) {
        const style = getComputedStyle(el);
        const marginRight = parseFloat(style.marginRight) || 0;
        setCardWidth(el.offsetWidth + marginRight);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [trendingMovies]);

  useEffect(() => {
    if (trendingMovies.length === 0) return;
    const interval = setInterval(() => {
      if (!paused) {
        setIndex(i => (i + 1) % trendingMovies.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [trendingMovies, paused]);

  const prev = () => { setIndex(i => (i - 1 + trendingMovies.length) % trendingMovies.length); }
  const next = () => { setIndex(i => (i + 1) % trendingMovies.length); }

  return (  
    <>
      <main>
        <h1>Trending Movies</h1>
        <div 
          className="movies-caroussel" 
          ref={containerRef} 
          onMouseEnter={() => setPaused(true)} 
          onMouseLeave={() => setPaused(false)}
        >
          <button className="carousel-btn prev" onClick={prev} aria-label="Précédent">‹</button>

          <div 
            className="carousel-track" 
            ref={trackRef}
            style={{ transform: `translateX(-${index * cardWidth}px)` }}
          >
            {trendingMovies.map((movie, idx) => (
              <div 
                key={movie.id} 
                className="movie-card" 
                ref={idx === 0 ? cardRef : null}
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
                  alt={movie.title} 
                />
                <h2>{movie.title}</h2>
              </div>
            ))}
          </div>

          <button className="carousel-btn next" onClick={next} aria-label="Suivant">›</button>
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
