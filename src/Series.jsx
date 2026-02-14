import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchSeriesData, fetchByGenre, fetchByActor } from './Fetcher.jsx';
import FilterPanel from './FilterPanel.jsx';
import './Series.css';

export default function Series() {
  const [series, setSeries] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [loading, setLoading] = useState(true);
  const [hasFilters, setHasFilters] = useState(false);

  // Load initial data
  useEffect(() => {
    setLoading(true);
    fetchSeriesData().then(data => {
      if (data) {
        const allSeries = [...data.popular, ...data.topRated, ...data.airingToday, ...data.onTheAir];
        // Remove duplicates
        const uniqueSeries = Array.from(new Map(allSeries.map(s => [s.id, s])).values());
        // Sort by popularity
        uniqueSeries.sort((a, b) => b.popularity - a.popularity);
        setSeries(uniqueSeries);
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
        data = await fetchByActor('tv', selectedActor.id, sortBy);
      } else if (selectedGenre) {
        data = await fetchByGenre('tv', selectedGenre, sortBy);
      }

      if (data && data.results) {
        setSeries(data.results);
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
    <div id="series">
      <div className="series-header">
        <h1>TV Series</h1>
      </div>

      <FilterPanel 
        type="tv"
        onGenreChange={handleGenreChange}
        onActorChange={handleActorChange}
        onSortChange={handleSortChange}
        selectedGenre={selectedGenre}
        selectedActor={selectedActor}
        sortBy={sortBy}
      />

      {loading && <p className="loading-text">Loading...</p>}

      {!loading && series.length === 0 && (
        <div className="series-section">
          <p className="no-results">No TV series found. Try different filters.</p>
        </div>
      )}

      {!loading && series.length > 0 && (
        <section className="series-section">
          {hasFilters && selectedGenre && (
            <h2 className="section-title">Filtered Results</h2>
          )}
          {hasFilters && selectedActor && (
            <h2 className="section-title">Series with {selectedActor.name}</h2>
          )}
          {!hasFilters && (
            <h2 className="section-title">All TV Series</h2>
          )}
          <div className="series-grid">
            {series.map(s => (
              <Link key={s.id} to={`/tv/${s.id}`} className="series-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${s.poster_path}`}
                  alt={s.name}
                  className="series-poster"
                />
                <div className="series-info">
                  <h3 className="series-title">{s.name}</h3>
                  <p className="series-rating">★ {s.vote_average.toFixed(1)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}