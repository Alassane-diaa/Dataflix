import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isFavorite, addFavorite, removeFavorite } from '../features/favorites/favoritesUtils.js';
import './ItemCard.css';

export default function ItemCard({ item, type, showMeta = false }) {
  const mediaType = type || item.media_type || (item.title ? 'movie' : 'tv');
  const title = item.title || item.name;
  const linkPath = `/${mediaType}/${item.id}`;  
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(isFavorite(mediaType, item.id));
  }, [mediaType, item.id]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFav) {
      removeFavorite(mediaType, item.id);
      setIsFav(false);
    } else {
      addFavorite({
        id: item.id,
        type: mediaType,
        title: title,
        posterPath: item.poster_path
      });
      setIsFav(true);
    }
  };
  
  const getYear = () => {
    const date = item.release_date || item.first_air_date;
    return date ? new Date(date).getFullYear() : '';
  };

  return (
    <div className="item-card">
      <Link to={linkPath} className="item-card-link">
        {item.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={title}
            className="item-poster"
          />
        ) : (
          <div className="item-poster-placeholder">
            <span>Pas d'image</span>
          </div>
        )}
        <div className="item-info">
          <h3 className="item-title">{title}</h3>
          {showMeta && (
            <div className="item-meta">
              <span className="item-type">
                {mediaType === 'movie' ? 'Film' : 'Série'}
              </span>
              {getYear() && (
                <span className="item-year"> • {getYear()}</span>
              )}
            </div>
          )}
          {item.vote_average > 0 && (
            <p className="item-rating">★ {item.vote_average.toFixed(1)}</p>
          )}
        </div>
      </Link>
      <button 
        className={`favorite-btn ${isFav ? 'is-favorite' : ''}`}
        onClick={toggleFavorite}
        aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    </div>
  );
}
