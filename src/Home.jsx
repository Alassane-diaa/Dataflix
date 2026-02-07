import { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { fetchHomeData } from './Fetcher.jsx'
import logo from './assets/logo.png'
import './Home.css'

export function Home() {
  const [trendingMovies, setTrendingMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [upcomingMovies, setUpcomingMovies] = useState([])
  const [popularSeries, setPopularSeries] = useState([])
  
  const [showAllSeries, setShowAllSeries] = useState(false)
  const [showAllTopRated, setShowAllTopRated] = useState(false)
  const [showAllUpcoming, setShowAllUpcoming] = useState(false)
  
  useEffect(() => {
    fetchHomeData().then(data => {
      if (data) {
        setTrendingMovies(data.trending);
        setTopRatedMovies(data.topRated);
        setUpcomingMovies(data.upcoming);
        setPopularSeries(data.popularSeries);
      }
    });
  }, []);

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const cardRef = useRef(null);
  const thumbStripRef = useRef(null);
  const seriesRef = useRef(null);
  const topRatedRef = useRef(null);
  const upcomingRef = useRef(null);
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
      const stripRect = strip.getBoundingClientRect();
      const thumbRect = activeThumb.getBoundingClientRect();
      const scrollLeft = strip.scrollLeft + (thumbRect.left - stripRect.left) - (stripRect.width / 2) + (thumbRect.width / 2);
      strip.scrollTo({ left: scrollLeft, behavior: 'smooth' });
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

  const toggleSeries = () => {
    if (showAllSeries && seriesRef.current) {
      seriesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setShowAllSeries(!showAllSeries);
  };

  const toggleTopRated = () => {
    if (showAllTopRated && topRatedRef.current) {
      topRatedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setShowAllTopRated(!showAllTopRated);
  };

  const toggleUpcoming = () => {
    if (showAllUpcoming && upcomingRef.current) {
      upcomingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setShowAllUpcoming(!showAllUpcoming);
  };

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
                <Link to={`/movie/${activeMovie.id}`} className="btn-info">More Info</Link>
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

        <section className="content-section" ref={seriesRef}>
          <h2 className="section-title">Popular Series</h2>
          <div className="movies-grid">
            {popularSeries.slice(0, showAllSeries ? popularSeries.length : 6).map(series => (
              <Link key={series.id} to={`/tv/${series.id}`} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                  alt={series.name}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h3 className="movie-title">{series.name}</h3>
                  <p className="movie-rating">⭐ {series.vote_average.toFixed(1)}</p>
                </div>
              </Link>
            ))}
          </div>
          {popularSeries.length > 6 && (
            <button className="btn-show-more" onClick={toggleSeries}>
              {showAllSeries ? 'Afficher moins' : 'Afficher plus'}
            </button>
          )}
        </section>

        <section className="content-section" ref={topRatedRef}>
          <h2 className="section-title">Top Rated</h2>
          <div className="movies-grid">
            {topRatedMovies.slice(0, showAllTopRated ? topRatedMovies.length : 6).map(movie => (
              <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</p>
                </div>
              </Link>
            ))}
          </div>
          {topRatedMovies.length > 6 && (
            <button className="btn-show-more" onClick={toggleTopRated}>
              {showAllTopRated ? 'Afficher moins' : 'Afficher plus'}
            </button>
          )}
        </section>

        {/* Section Upcoming */}
        <section className="content-section" ref={upcomingRef}>
          <h2 className="section-title">Coming Soon</h2>
          <div className="movies-grid">
            {upcomingMovies.slice(0, showAllUpcoming ? upcomingMovies.length : 6).map(movie => (
              <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-release">{new Date(movie.release_date).getFullYear()}</p>
                </div>
              </Link>
            ))}
          </div>
          {upcomingMovies.length > 6 && (
            <button className="btn-show-more" onClick={toggleUpcoming}>
              {showAllUpcoming ? 'Afficher moins' : 'Afficher plus'}
            </button>
          )}
        </section>
      </main>
    </>
  )
}

export function Header() {
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
