import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFavorites, removeFavorite } from './favoritesUtils.js';
import removeIcon from '../../assets/remove-icon.png';
import "./Favorites.css";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fav = getFavorites();
    setFavorites(fav);
    setLoading(false);
  }, []);

  const handleRemove = (type, id) => {
    removeFavorite(type, id);
    setFavorites(favorites.filter(fav => !(fav.type === type && fav.id === id)));
  };

  if (loading) {
    return <div id="favorites"><p>Loading...</p></div>;
  }

  return (
    <div id="favorites">
      <div className="favorites-header">
        <h1>My Favorites</h1>
        {favorites.length > 0 && <p className="favorites-count">{favorites.length} item{favorites.length > 1 ? 's' : ''} saved</p>}
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <p>You don't have any favorites yet.</p>
          <p>Click "Add to Favorites" on movie and series pages!</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(fav => (
            <div key={`${fav.type}-${fav.id}`} className="favorite-card">
              <Link to={`/${fav.type}/${fav.id}`} className="favorite-card-link">
                <img
                  src={`https://image.tmdb.org/t/p/w500${fav.posterPath}`}
                  alt={fav.title}
                  className="favorite-poster"
                />
                <div className="favorite-overlay">
                  <h3>{fav.title}</h3>
                </div>
              </Link>
              <button 
                className="remove-favorite-btn"
                onClick={() => handleRemove(fav.type, fav.id)}
                title="Remove from favorites"
              >
                <img src={removeIcon} alt="Remove" className="remove-icon" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}