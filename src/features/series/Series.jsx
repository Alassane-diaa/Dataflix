import { useState, useEffect } from 'react';
import { fetchSeriesData, fetchByGenre, fetchByActor } from '../../services/Fetcher.js';
import FilterPanel from '../../components/FilterPanel.jsx';
import ItemCard from '../../components/ItemCard.jsx';

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
    <div className="page-container">
      <div className="page-header">
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
        <div className="page-section">
          <p className="no-results">No TV series found. Try different filters.</p>
        </div>
      )}

      {!loading && series.length > 0 && (
        <section className="page-section">
          {hasFilters && selectedGenre && (
            <h2 className="section-title">Filtered Results</h2>
          )}
          {hasFilters && selectedActor && (
            <h2 className="section-title">Series with {selectedActor.name}</h2>
          )}
          {!hasFilters && (
            <h2 className="section-title">All TV Series</h2>
          )}
          <div className="card-grid">
            {series.map(s => (
              <ItemCard key={s.id} item={s} type="tv" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}