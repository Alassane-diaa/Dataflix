import { useState, useEffect } from 'react';
import { getFavorites } from './favoritesUtils.js';
import ItemCard from '../../components/ItemCard.jsx';
import "./Favorites.css";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadFavorites = () => {
      const fav = getFavorites();
      setFavorites(fav);
      setLoading(false);
    };

    loadFavorites();

    // Listen for storage changes to refresh favorites
    const handleStorageChange = () => {
      loadFavorites();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadFavorites, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [refreshKey]);

  if (loading) {
    return <div className="page-container"><p className="loading-text">Loading...</p></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Favorites</h1>
        {favorites.length > 0 && <p className="favorites-count">{favorites.length} item{favorites.length > 1 ? 's' : ''} saved</p>}
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <p>You don't have any favorites yet.</p>
          <p>Click the heart icon on movies and series to add them here!</p>
        </div>
      ) : (
        <div className="page-section">
          <div className="card-grid">
            {favorites.map(fav => (
              <ItemCard 
                key={`${fav.type}-${fav.id}`}
                item={{
                  id: fav.id,
                  title: fav.title,
                  name: fav.title,
                  poster_path: fav.posterPath,
                  vote_average: 0
                }}
                type={fav.type}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}