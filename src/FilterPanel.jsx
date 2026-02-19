import { useState, useEffect, useRef } from 'react';
import { fetchGenres, searchActor } from './Fetcher.jsx';
import './FilterPanel.css';

export default function FilterPanel({ 
  type, 
  onGenreChange, 
  onActorChange, 
  onSortChange,
  selectedGenre,
  selectedActor,
  sortBy 
}) {
  const [genres, setGenres] = useState([]);
  const [actorSearch, setActorSearch] = useState('');
  const [actors, setActors] = useState([]);
  const [showActorList, setShowActorList] = useState(false);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const searchTimeoutRef = useRef(null);

  // Load genres on mount
  useEffect(() => {
    setLoadingGenres(true);
    fetchGenres(type).then(data => {
      if (data) setGenres(data.genres || []);
      setLoadingGenres(false);
    });
  }, [type]);

  // Update actor search input when selectedActor changes
  useEffect(() => {
    if (selectedActor?.name) {
      setActorSearch(selectedActor.name);
    } else {
      setActorSearch('');
    }
  }, [selectedActor]);

  // Search for actors with debounce
  const handleSearchActor = (query) => {
    setActorSearch(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length > 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        const data = await searchActor(query);
        if (data) {
          const filteredActors = data.results.filter(actor => actor.profile_path);
          setActors(filteredActors || []);
          setShowActorList(true);
        }
      }, 300);
    } else {
      setActors([]);
      setShowActorList(false);
    }
  };

  const selectActor = (actor) => {
    onActorChange(actor.id, actor.name);
    setShowActorList(false);
  };

  const clearActor = () => {
    onActorChange(null, null);
    setActorSearch('');
    setActors([]);
    setShowActorList(false);
  };

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label htmlFor="genre-select">Genre</label>
        <select 
          id="genre-select"
          value={selectedGenre || ''} 
          onChange={(e) => onGenreChange(e.target.value)}
          disabled={loadingGenres}
        >
          <option value="">All Genres</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group actor-group">
        <label htmlFor="actor-search">Actor</label>
        <div className="actor-input-wrapper">
          <input
            id="actor-search"
            type="text"
            placeholder="Search actor..."
            value={actorSearch}
            onChange={(e) => handleSearchActor(e.target.value)}
            onFocus={() => actors.length > 0 && setShowActorList(true)}
          />
          {selectedActor && (
            <button 
              className="clear-actor-btn"
              onClick={clearActor}
              title="Clear actor"
            >
              ✕
            </button>
          )}
          {showActorList && actors.length > 0 && (
            <div className="actor-dropdown">
              {actors.slice(0, 10).map(actor => (
                <div 
                  key={actor.id} 
                  className="actor-option"
                  onClick={() => selectActor(actor)}
                >
                  {actor.profile_path && (
                    <img 
                      src={`https://image.tmdb.org/t/p/w45${actor.profile_path}`}
                      alt={actor.name}
                      className="actor-thumb"
                    />
                  )}
                  <div className="actor-info">
                    <div className="actor-name">{actor.name}</div>
                    {actor.known_for_department && (
                      <div className="actor-dept">{actor.known_for_department}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-select">Sort By</label>
        <select 
          id="sort-select"
          value={sortBy} 
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="popularity.desc">Most Popular</option>
          <option value="popularity.asc">Least Popular</option>
          <option value="vote_average.desc">Highest Rated</option>
          <option value="release_date.desc">Newest First</option>
          <option value="release_date.asc">Oldest First</option>
          <option value="vote_count.desc">Most Voted</option>
        </select>
      </div>
    </div>
  );
}
