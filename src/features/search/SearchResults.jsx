import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchMulti } from '../../services/Fetcher.js';
import './SearchResults.css';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    searchMulti(query).then(data => {
      if (data && data.results) {
        // Filter only movies and TV shows
        const filtered = data.results.filter(
          item => item.media_type === 'movie' || item.media_type === 'tv'
        );
        setResults(filtered);
      }
      setLoading(false);
    });
  }, [query]);

  const getTitle = (item) => {
    return item.media_type === 'movie' ? item.title : item.name;
  };

  const getYear = (item) => {
    const date = item.media_type === 'movie' ? item.release_date : item.first_air_date;
    return date ? new Date(date).getFullYear() : '';
  };

  return (
    <div id="search-results">
      <div className="search-header">
        <h1>
          {query ? `Résultats pour "${query}"` : 'Recherche'}
        </h1>
        {!loading && results.length > 0 && (
          <p className="results-count">{results.length} résultat{results.length > 1 ? 's' : ''}</p>
        )}
      </div>

      {loading && <p className="loading-text">Recherche en cours...</p>}

      {!loading && !query && (
        <div className="no-query">
          <p>Entrez un terme de recherche dans le header pour commencer.</p>
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="no-results">
          <p>Aucun résultat trouvé pour "{query}".</p>
          <p>Essayez avec d'autres mots-clés.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <section className="results-grid-section">
          <div className="results-grid">
            {results.map(item => (
              <Link
                key={`${item.media_type}-${item.id}`}
                to={`/${item.media_type}/${item.id}`}
                className="result-card"
              >
                {item.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={getTitle(item)}
                    className="result-poster"
                  />
                ) : (
                  <div className="result-poster-placeholder">
                    <span>Pas d'image</span>
                  </div>
                )}
                <div className="result-info">
                  <h3 className="result-title">{getTitle(item)}</h3>
                  <div className="result-meta">
                    <span className="result-type">
                      {item.media_type === 'movie' ? 'Film' : 'Série'}
                    </span>
                    {getYear(item) && (
                      <span className="result-year"> • {getYear(item)}</span>
                    )}
                  </div>
                  {item.vote_average > 0 && (
                    <p className="result-rating">★ {item.vote_average.toFixed(1)}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
