import { useState, useEffect } from 'react';
import { fetchSeriesData } from './Fetcher.jsx';
import './Series.css';

export default function Series() {
  const [popularSeries, setPopularSeries] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);
  const [airingTodaySeries, setAiringTodaySeries] = useState([]);
  const [onTheAirSeries, setOnTheAirSeries] = useState([]);

  const [showAllPopular, setShowAllPopular] = useState(false);
  const [showAllTopRated, setShowAllTopRated] = useState(false);
  const [showAllAiringToday, setShowAllAiringToday] = useState(false);
  const [showAllOnTheAir, setShowAllOnTheAir] = useState(false);

  useEffect(() => {
    fetchSeriesData().then(data => {
      if (data) {
        setPopularSeries(data.popular);
        setTopRatedSeries(data.topRated);
        setAiringTodaySeries(data.airingToday);
        setOnTheAirSeries(data.onTheAir);
      }
    });
  }, []);

  return (
    <div id="series">
      <div className="series-header">
        <h1>TV Series</h1>
      </div>

      <section className="series-section">
        <h2 className="section-title">Popular Series</h2>
        <div className="series-grid">
          {popularSeries.slice(0, showAllPopular ? popularSeries.length : 12).map(series => (
            <div key={series.id} className="series-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                alt={series.name}
                className="series-poster"
              />
              <div className="series-info">
                <h3 className="series-title">{series.name}</h3>
                <p className="series-rating">⭐ {series.vote_average.toFixed(1)}</p>
              </div>
            </div>
          ))}
        </div>
        {popularSeries.length > 12 && (
          <button className="btn-show-more" onClick={() => setShowAllPopular(!showAllPopular)}>
            {showAllPopular ? 'Afficher moins' : 'Afficher plus'}
          </button>
        )}
      </section>

      <section className="series-section">
        <h2 className="section-title">Top Rated Series</h2>
        <div className="series-grid">
          {topRatedSeries.slice(0, showAllTopRated ? topRatedSeries.length : 12).map(series => (
            <div key={series.id} className="series-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                alt={series.name}
                className="series-poster"
              />
              <div className="series-info">
                <h3 className="series-title">{series.name}</h3>
                <p className="series-rating">⭐ {series.vote_average.toFixed(1)}</p>
              </div>
            </div>
          ))}
        </div>
        {topRatedSeries.length > 12 && (
          <button className="btn-show-more" onClick={() => setShowAllTopRated(!showAllTopRated)}>
            {showAllTopRated ? 'Afficher moins' : 'Afficher plus'}
          </button>
        )}
      </section>

      <section className="series-section">
        <h2 className="section-title">Airing Today</h2>
        <div className="series-grid">
          {airingTodaySeries.slice(0, showAllAiringToday ? airingTodaySeries.length : 12).map(series => (
            <div key={series.id} className="series-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                alt={series.name}
                className="series-poster"
              />
              <div className="series-info">
                <h3 className="series-title">{series.name}</h3>
                <p className="series-rating">⭐ {series.vote_average.toFixed(1)}</p>
              </div>
            </div>
          ))}
        </div>
        {airingTodaySeries.length > 12 && (
          <button className="btn-show-more" onClick={() => setShowAllAiringToday(!showAllAiringToday)}>
            {showAllAiringToday ? 'Afficher moins' : 'Afficher plus'}
          </button>
        )}
      </section>

      <section className="series-section">
        <h2 className="section-title">On The Air</h2>
        <div className="series-grid">
          {onTheAirSeries.slice(0, showAllOnTheAir ? onTheAirSeries.length : 12).map(series => (
            <div key={series.id} className="series-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                alt={series.name}
                className="series-poster"
              />
              <div className="series-info">
                <h3 className="series-title">{series.name}</h3>
                <p className="series-rating">⭐ {series.vote_average.toFixed(1)}</p>
              </div>
            </div>
          ))}
        </div>
        {onTheAirSeries.length > 12 && (
          <button className="btn-show-more" onClick={() => setShowAllOnTheAir(!showAllOnTheAir)}>
            {showAllOnTheAir ? 'Afficher moins' : 'Afficher plus'}
          </button>
        )}
      </section>
    </div>
  );
}