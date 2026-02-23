import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMulti } from '../../services/Fetcher.js';
import ItemCard from '../../components/ItemCard.jsx';
import FilterPanel from '../../components/FilterPanel.jsx';
import './SearchResults.css';

function sortLocally(arr, sortBy) {
  const sorted = [...arr];
  switch (sortBy) {
    case 'popularity.asc':    sorted.sort((a, b) => a.popularity - b.popularity); break;
    case 'vote_average.desc': sorted.sort((a, b) => b.vote_average - a.vote_average); break;
    case 'vote_count.desc':   sorted.sort((a, b) => b.vote_count - a.vote_count); break;
    case 'release_date.desc':
      sorted.sort((a, b) => new Date(b.release_date || b.first_air_date || 0) - new Date(a.release_date || a.first_air_date || 0));
      break;
    case 'release_date.asc':
      sorted.sort((a, b) => new Date(a.release_date || a.first_air_date || 0) - new Date(b.release_date || b.first_air_date || 0));
      break;
    default: sorted.sort((a, b) => b.popularity - a.popularity); break;
  }
  return sorted;
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [rawResults, setRawResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    setMediaTypeFilter('all');
    setSelectedGenre(null);
    setSortBy('popularity.desc');

    if (!query) {
      setRawResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    searchMulti(query).then(data => {
      if (data && data.results) {
        const filtered = data.results.filter(
          item => item.media_type === 'movie' || item.media_type === 'tv'
        );
        setRawResults(filtered);
      }
      setLoading(false);
    });
  }, [query]);

  const displayedResults = useMemo(() => {
    let items = rawResults;

    if (mediaTypeFilter !== 'all') {
      items = items.filter(item => item.media_type === mediaTypeFilter);
    }

    if (selectedGenre) {
      items = items.filter(item =>
        Array.isArray(item.genre_ids) && item.genre_ids.includes(Number(selectedGenre))
      );
    }

    return sortLocally(items, sortBy);
  }, [rawResults, mediaTypeFilter, selectedGenre, sortBy]);

  const genreType = mediaTypeFilter === 'all' ? 'movie' : mediaTypeFilter;

  return (
    <div className="page-container">
      <div className="search-header">
        <h1>
          {query ? `Résultats pour "${query}"` : 'Recherche'}
        </h1>
        {!loading && rawResults.length > 0 && (
          <p className="results-count">
            {displayedResults.length} résultat{displayedResults.length <= 1 ? '' : 's'}
          </p>
        )}
      </div>

      {query && (
        <FilterPanel
          type={genreType}
          onGenreChange={(id) => setSelectedGenre(id || null)}
          onSortChange={setSortBy}
          selectedGenre={selectedGenre}
          sortBy={sortBy}
          showActor={false}
          onTypeChange={setMediaTypeFilter}
          mediaType={mediaTypeFilter}
        />
      )}

      {loading && <p className="loading-text">Recherche en cours...</p>}

      {!loading && !query && (
        <div className="no-query">
          <p>Entrez un terme de recherche pour commencer.</p>
        </div>
      )}

      {!loading && query && displayedResults.length === 0 && (
        <div className="no-results">
          <p>Aucun résultat{selectedGenre || mediaTypeFilter !== 'all' ? ' pour ces filtres' : ` pour "${query}"`}.</p>
          {(selectedGenre || mediaTypeFilter !== 'all') && (
            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Essayez de modifier les filtres.</p>
          )}
        </div>
      )}

      {!loading && displayedResults.length > 0 && (
        <section className="results-grid-section">
          <div className="card-grid">
            {displayedResults.map(item => (
              <ItemCard
                key={`${item.media_type}-${item.id}`}
                item={item}
                showMeta={true}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
