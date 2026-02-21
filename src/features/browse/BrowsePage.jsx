import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchMoviesData,
  fetchSeriesData,
  fetchByGenre,
  fetchByActor,
} from '../../services/Fetcher.js';
import FilterPanel from '../../components/FilterPanel.jsx';
import ItemCard from '../../components/ItemCard.jsx';

/* Page générique pour les films et séries */

const CONFIG = {
  movie: {
    title: 'Movies',
    fetchInitial: fetchMoviesData,
    merge: (d) => [...d.popular, ...d.topRated, ...d.nowPlaying, ...d.upcoming],
    emptyMessage: 'No movies found. Try different filters.',
  },
  tv: {
    title: 'TV Series',
    fetchInitial: fetchSeriesData,
    merge: (d) => [...d.popular, ...d.topRated, ...d.airingToday, ...d.onTheAir],
    emptyMessage: 'No TV series found. Try different filters.',
  },
};

export default function BrowsePage({ mediaType }) {
  const config = CONFIG[mediaType];

  const [items, setItems] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [loading, setLoading] = useState(true);
  const [hasFilters, setHasFilters] = useState(false);

  // Reset state and reload when switching between movie / tv
  useEffect(() => {
    setSelectedGenre(null);
    setSelectedActor(null);
    setSortBy('popularity.desc');
    setHasFilters(false);
    setLoading(true);

    config.fetchInitial().then(data => {
      if (data) {
        const merged = config.merge(data);
        const unique = Array.from(new Map(merged.map(m => [m.id, m])).values());
        unique.sort((a, b) => b.popularity - a.popularity);
        setItems(unique);
      }
      setLoading(false);
    });
  }, [mediaType]); 

  // Apply filters / sort
  useEffect(() => {
    if (!selectedGenre && !selectedActor) {
      setHasFilters(false);
      return;
    }

    setHasFilters(true);
    setLoading(true);

    const fetchFiltered = async () => {
      let data;
      if (selectedActor?.id) {
        data = await fetchByActor(mediaType, selectedActor.id, sortBy);
      } else if (selectedGenre) {
        data = await fetchByGenre(mediaType, selectedGenre, sortBy);
      }
      if (data?.results) setItems(data.results);
      setLoading(false);
    };

    fetchFiltered();
  }, [selectedGenre, selectedActor, sortBy, mediaType]);

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId || null);
    setSelectedActor(null);
  };

  const handleActorChange = (actorId, actorName) => {
    if (actorId) {
      setSelectedActor({ id: actorId, name: actorName });
      setSelectedGenre(null);
    } else {
      setSelectedActor(null);
    }
  };

  if (!config) return <p className="loading-text">Unknown media type.</p>;

  const sectionTitle = hasFilters
    ? selectedActor
      ? `${config.title} with ${selectedActor.name}`
      : 'Filtered Results'
    : `All ${config.title}`;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{config.title}</h1>
      </div>

      <FilterPanel
        type={mediaType}
        onGenreChange={handleGenreChange}
        onActorChange={handleActorChange}
        onSortChange={setSortBy}
        selectedGenre={selectedGenre}
        selectedActor={selectedActor}
        sortBy={sortBy}
      />

      {loading && <p className="loading-text">Loading...</p>}

      {!loading && items.length === 0 && (
        <div className="page-section">
          <p className="no-results">{config.emptyMessage}</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <section className="page-section">
          <h2 className="section-title">{sectionTitle}</h2>
          <div className="card-grid">
            {items.map(item => (
              <ItemCard key={item.id} item={item} type={mediaType} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
