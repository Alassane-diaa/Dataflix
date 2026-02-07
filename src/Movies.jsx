import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMoviesData } from './Fetcher.jsx';
import './Movies.css';

export default function Movies() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  const [showAllPopular, setShowAllPopular] = useState(false);
  const [showAllTopRated, setShowAllTopRated] = useState(false);
  const [showAllNowPlaying, setShowAllNowPlaying] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);

  useEffect(() => {
    fetchMoviesData().then(data => {
      if (data) {
        setPopularMovies(data.popular);
        setTopRatedMovies(data.topRated);
        setNowPlayingMovies(data.nowPlaying);
        setUpcomingMovies(data.upcoming);
      }
    });
  }, []);

  return (
    <div id="movies">
      <div className="movies-header">
        <h1>Movies</h1>
      </div>

      <section className="movies-section">
        <h2 className="section-title">Popular Movies</h2>
        <div className="movies-grid">
          {popularMovies.slice(0, showAllPopular ? popularMovies.length : 12).map(movie => (
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
        {popularMovies.length > 12 && (
          <button className="btn-show-more" onClick={() => setShowAllPopular(!showAllPopular)}>
            {showAllPopular ? 'Afficher moins' : 'Afficher plus'}
          </button>
        )}
      </section>

      <section className="movies-section">
        <h2 className="section-title">Top Rated Movies</h2>
        <div className="movies-grid">
          {topRatedMovies.slice(0, showAllTopRated ? topRatedMovies.length : 12).map(movie => (
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
        {topRatedMovies.length > 12 && (
          <button className="btn-show-more" onClick={() => setShowAllTopRated(!showAllTopRated)}>
            {showAllTopRated ? 'Afficher moins' : 'Afficher plus'}
          </button>
        )}
      </section>

      <section className="movies-section">
        <h2 className="section-title">Now Playing</h2>
        <div className="movies-grid">
          {nowPlayingMovies.slice(0, showAllNowPlaying ? nowPlayingMovies.length : 12).map(movie => (
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
        {nowPlayingMovies.length > 12 && (
          <button className="btn-show-more" onClick={() => setShowAllNowPlaying(!showAllNowPlaying)}>
            {showAllNowPlaying ? 'Afficher moins' : 'Afficher plus'}
          </button>
        )}
      </section>

      <section className="movies-section">
        <h2 className="section-title">Upcoming</h2>
        <div className="movies-grid">
          {upcomingMovies.slice(0, showAllUpcoming ? upcomingMovies.length : 12).map(movie => (
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
        {upcomingMovies.length > 12 && (
          <button className="btn-show-more" onClick={() => setShowAllUpcoming(!showAllUpcoming)}>
            {showAllUpcoming ? 'Afficher moins' : 'Afficher plus'}
          </button>
        )}
      </section>
    </div>
  );
}