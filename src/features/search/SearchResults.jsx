import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMulti } from '../../services/Fetcher.js';
import ItemCard from '../../components/ItemCard.jsx';
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

  return (
    <div className="page-container">
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
          <div className="card-grid">
            {results.map(item => (
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
