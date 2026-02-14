import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchItemDetails } from './Fetcher.jsx';
import { isFavorited, toggleFavorite } from './favoritesUtils.js';
import heartIcon from './assets/heart-icon.png';
import heartFilledIcon from './assets/heart-filled-icon.png';
import './ItemPage.css';

export default function ItemPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchItemDetails(type, id).then(data => {
      if (data) {
        setItem(data);
        setIsFav(isFavorited(type, id));
      }
      setLoading(false);
    });
  }, [type, id]);

  if (loading) {
    return <div className="item-page loading">Loading...</div>;
  }

  if (!item) {
    return <div className="item-page error">Item not found</div>;
  }

  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const runtime = item.runtime || (item.episode_run_time && item.episode_run_time[0]);

  return (
    <div className="item-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <button 
        className={`favorite-button ${isFav ? 'favorited' : ''}`}
        onClick={() => {
          toggleFavorite(type, id, title, item.poster_path);
          setIsFav(!isFav);
        }}
        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
      >
        <img 
          src={isFav ? heartFilledIcon : heartIcon} 
          alt={isFav ? 'Remove' : 'Add'}
          className="favorite-button-icon"
        />
        {isFav ? 'Favorited' : 'Add to Favorites'}
      </button>

      <div 
        className="item-hero"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`
        }}
      >
        <div className="item-hero-overlay" />
        <div className="item-hero-content">
          <div className="item-poster-container">
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={title}
              className="item-poster"
            />
          </div>

          <div className="item-details">
            <h1 className="item-title">{title}</h1>
            
            <div className="item-meta">
              {releaseDate && (
                <span className="meta-item">{new Date(releaseDate).getFullYear()}</span>
              )}
              {runtime && (
                <span className="meta-item">{runtime} minutes</span>
              )}
              <span className="meta-item rating">★ {item.vote_average.toFixed(1)}/10</span>
            </div>

            {item.genres && item.genres.length > 0 && (
              <div className="item-genres">
                {item.genres.map(genre => (
                  <span key={genre.id} className="genre-tag">{genre.name}</span>
                ))}
              </div>
            )}

            <p className="item-tagline">{item.tagline}</p>
            
            <div className="item-overview">
              <h2>Overview</h2>
              <p>{item.overview || 'No overview available.'}</p>
            </div>

            {item.credits && item.credits.cast && item.credits.cast.length > 0 && (
              <div className="item-cast">
                <h2>Cast</h2>
                <div className="cast-list">
                  {item.credits.cast.slice(0, 6).map(actor => (
                    <div key={actor.id} className="cast-member">
                      {actor.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                          className="cast-photo"
                        />
                      ) : (
                        <div className="cast-photo-placeholder">?</div>
                      )}
                      <div className="cast-info">
                        <p className="cast-name">{actor.name}</p>
                        <p className="cast-character">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {type === 'tv' && item.seasons && (
              <div className="item-seasons">
                <h2>Seasons ({item.number_of_seasons})</h2>
                <p className="seasons-info">{item.number_of_episodes} episodes total</p>
              </div>
            )}

            {item.production_companies && item.production_companies.length > 0 && (
              <div className="item-production">
                <h2>Production</h2>
                <div className="production-companies">
                  {item.production_companies.slice(0, 4).map(company => (
                    <span key={company.id} className="company-name">{company.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
