import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMoviesData, fetchByGenre, fetchByActor } from '../../services/Fetcher.js';
import FilterPanel from '../../components/FilterPanel.jsx';
import './Movies.css';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [loading, setLoading] = useState(true);
  const [hasFilters, setHasFilters] = useState(false);

  // Load initial data
  useEffect(() => {
    setLoading(true);
    fetchMoviesData().then(data => {
      if (data) {
        const allMovies = [...data.popular, ...data.topRated, ...data.nowPlaying, ...data.upcoming];
        // Remove duplicates
        const uniqueMovies = Array.from(new Map(allMovies.map(m => [m.id, m])).values());
        // Sort by popularity
        uniqueMovies.sort((a, b) => b.popularity - a.popularity);
        setMovies(uniqueMovies);
      }
      setLoading(false);
    });
  }, []);

  // Apply filters
  useEffect(() => {
    if (!selectedGenre && !selectedActor) {
      setHasFilters(false);
      return;
    }

    setHasFilters(true);
    setLoading(true);

    const fetchFilteredData = async () => {
      let data;
      
      if (selectedActor?.id) {
        data = await fetchByActor('movie', selectedActor.id, sortBy);
      } else if (selectedGenre) {
        data = await fetchByGenre('movie', selectedGenre, sortBy);
      }

      if (data && data.results) {
        setMovies(data.results);
      }
      setLoading(false);
    };

    fetchFilteredData();
  }, [selectedGenre, selectedActor, sortBy]);

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId || null);
    setSelectedActor(null); // Reset actor when changing genre
  };

  const handleActorChange = (actorId, actorName) => {
    if (actorId) {
      setSelectedActor({ id: actorId, name: actorName });
      setSelectedGenre(null); // Reset genre when changing actor
    } else {
      setSelectedActor(null);
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  return (
    <div id="movies">
      <div className="movies-header">
        <h1>Movies</h1>
      </div>

      <FilterPanel 
        type="movie"
        onGenreChange={handleGenreChange}
        onActorChange={handleActorChange}
        onSortChange={handleSortChange}
        selectedGenre={selectedGenre}
        selectedActor={selectedActor}
        sortBy={sortBy}
      />

      {loading && <p className="loading-text">Loading...</p>}

      {!loading && movies.length === 0 && (
        <div className="movies-section">
          <p className="no-results">No movies found. Try different filters.</p>
        </div>
      )}

      {!loading && movies.length > 0 && (
        <section className="movies-section">
          {hasFilters && selectedGenre && (
            <h2 className="section-title">Filtered Results</h2>
          )}
          {hasFilters && selectedActor && (
            <h2 className="section-title">Movies with {selectedActor.name}</h2>
          )}
          {!hasFilters && (
            <h2 className="section-title">All Movies</h2>
          )}
          <div className="movies-grid">
            {movies.map(movie => (
              <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-rating">★ {movie.vote_average.toFixed(1)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}