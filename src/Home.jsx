import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { fetchHomeData } from './Fetcher.jsx'
import logo from './assets/logo.png'
import './Home.css'

export function Home() {
  const [trendingMovies, setTrendingMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [upcomingMovies, setUpcomingMovies] = useState([])
  
  useEffect(() => {
    fetchHomeData().then(data => {
      if (data) {
        setTrendingMovies(data.trending);
        setTopRatedMovies(data.topRated);
        setUpcomingMovies(data.upcoming);
      }
    });
  }, []);

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const cardRef = useRef(null);
  const thumbStripRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const gap = 16;

  // Scroll des vignettes pour les garder au centre
  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;
    const activeThumb = strip.children[index];
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [index]);

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

  const activeMovie = trendingMovies[index];

  return (  
    <>
      <main className="home-main">
        {/* Affichage du film/série sur lequel on focus */}
        {activeMovie && (
          <section 
            className="hero"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <img
              className="hero-bg"
              src={`https://image.tmdb.org/t/p/w1280${activeMovie.backdrop_path}`}
              alt=""
            />
            <div className="hero-gradient" />
            <div className="hero-content">
              <h1 className="hero-title">{activeMovie.title}</h1>
              <p className="hero-overview">{activeMovie.overview}</p>
              <div className="hero-actions">
                <button className="btn-info">More Info</button>
              </div>
            </div>

            <button className="hero-nav prev" onClick={prev} aria-label="Previous">‹</button>
            <button className="hero-nav next" onClick={next} aria-label="Next">›</button>

            {/* Bande de vignettes en bas à droite */}
            <div className="thumb-strip" ref={thumbStripRef}>
              {trendingMovies.map((movie, idx) => (
                <button
                  key={movie.id}
                  className={`thumb${idx === index ? ' active' : ''}`}
                  onClick={() => setIndex(idx)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                  />
                </button>
              ))}
            </div>
          </section>
        )}
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
