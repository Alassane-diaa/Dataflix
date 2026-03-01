import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchItemDetails } from '../../services/Fetcher.js';
import { isFavorited, toggleFavorite } from '../favorites/favoritesUtils.js';
import './ItemPage.css';

export default function ItemPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setTrailerKey(null);
    setShowTrailer(false);
    fetchItemDetails(type, id).then(data => {
      if (data) {
        setItem(data);
        setIsFav(isFavorited(type, id));
        if (data.videos && data.videos.results) {
          const trailer =
            data.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
            data.videos.results.find(v => v.site === 'YouTube');
          if (trailer) setTrailerKey(trailer.key);
        }
      }
      setLoading(false);
    });
  }, [type, id]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setShowTrailer(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (loading) {
    return (
      <div className="item-page loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!item) {
    return <div className="item-page error">Contenu introuvable</div>;
  }

  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const runtime = item.runtime || (item.episode_run_time && item.episode_run_time[0]);
  const similarItems = item.similar?.results?.filter(i => i.poster_path).slice(0, 12) || [];

  const formatMoney = (amount) => {
    if (!amount || amount === 0) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="item-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        <span>Retour</span>
      </button>

      <button
        className={`favorite-button ${isFav ? 'favorited' : ''}`}
        onClick={() => {
          toggleFavorite(type, id, title, item.poster_path);
          setIsFav(!isFav);
        }}
        title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <svg className="btn-icon heart-icon" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <span>{isFav ? 'En favoris' : 'Favoris'}</span>
      </button>

      <div
        className="item-hero"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${item.backdrop_path})` }}
      >
        <div className="item-hero-overlay" />
        <div className="item-hero-content">
          <div className="item-poster-container">
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={title}
              className="item-poster"
            />
            {trailerKey && (
              <button className="trailer-button-poster" onClick={() => setShowTrailer(true)}>
                <span className="play-icon">▶</span>
                Bande-annonce
              </button>
            )}
          </div>

          <div className="item-details">
            <h1 className="item-title">{title}</h1>
            {item.tagline && <p className="item-tagline">"{item.tagline}"</p>}

            <div className="item-meta">
              {releaseDate && (
                <span className="meta-item">📅 {new Date(releaseDate).getFullYear()}</span>
              )}
              {runtime && (
                <span className="meta-item">⏱ {runtime} min</span>
              )}
              <span className="meta-item rating">★ {item.vote_average.toFixed(1)}</span>
              {item.vote_count > 0 && (
                <span className="meta-item vote-count">({item.vote_count.toLocaleString()} votes)</span>
              )}
            </div>

            {item.genres && item.genres.length > 0 && (
              <div className="item-genres">
                {item.genres.map(genre => (
                  <span key={genre.id} className="genre-tag">{genre.name}</span>
                ))}
              </div>
            )}

            <div className="item-overview">
              <h2>Résumé</h2>
              <p>{item.overview || 'Aucun résumé disponible.'}</p>
            </div>

            <div className="item-extra-info">
              {item.status && (
                <div className="info-row">
                  <span className="info-label">Statut</span>
                  <span className={`info-value status-badge status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {item.status}
                  </span>
                </div>
              )}
              {item.original_language && (
                <div className="info-row">
                  <span className="info-label">Langue originale</span>
                  <span className="info-value">{item.original_language.toUpperCase()}</span>
                </div>
              )}
              {type === 'tv' && item.number_of_seasons != null && (
                <div className="info-row">
                  <span className="info-label">Saisons</span>
                  <span className="info-value">
                    {item.number_of_seasons} saison{item.number_of_seasons > 1 ? 's' : ''} · {item.number_of_episodes} épisodes
                  </span>
                </div>
              )}
              {type === 'movie' && formatMoney(item.budget) && (
                <div className="info-row">
                  <span className="info-label">Budget</span>
                  <span className="info-value">{formatMoney(item.budget)}</span>
                </div>
              )}
              {type === 'movie' && formatMoney(item.revenue) && (
                <div className="info-row">
                  <span className="info-label">Box-office</span>
                  <span className="info-value revenue">{formatMoney(item.revenue)}</span>
                </div>
              )}
            </div>

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

      {item.credits?.cast?.length > 0 && (
        <section className="item-cast-section">
          <div className="section-inner">
            <h2>Casting</h2>
            <div className="cast-list">
              {item.credits.cast.slice(0, 8).map(actor => (
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
        </section>
      )}

      {similarItems.length > 0 && (
        <section className="item-similar-section">
          <div className="section-inner">
            <h2>Vous aimerez aussi</h2>
            <div className="similar-list">
              {similarItems.map(sim => (
                <div
                  key={sim.id}
                  className="similar-card"
                  onClick={() => navigate(`/${type}/${sim.id}`)}
                >
                  <div className="similar-poster-wrapper">
                    <img
                      src={`https://image.tmdb.org/t/p/w300${sim.poster_path}`}
                      alt={sim.title || sim.name}
                      className="similar-poster"
                    />
                    <div className="similar-overlay">
                      <span className="similar-rating">★ {sim.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="similar-title">{sim.title || sim.name}</p>
                  {(sim.release_date || sim.first_air_date) && (
                    <p className="similar-year">
                      {new Date(sim.release_date || sim.first_air_date).getFullYear()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Modal pour afficher le trailer quand il clique (c'est souvent un lien youtube) */}
      {showTrailer && trailerKey && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-modal-content" onClick={e => e.stopPropagation()}>
            <button className="trailer-close" onClick={() => setShowTrailer(false)}>✕</button>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          </div>
        </div>
      )}
    </div>
  );
}
