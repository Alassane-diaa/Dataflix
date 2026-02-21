import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })


export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-logo">
          <Link to="/" onClick={scrollTop}><img src={logo} alt="Dataflix" /></Link>
        </div>

        <nav className="footer-nav">
          <div className="footer-col">
            <h4>Explorer</h4>
            <ul>
              <li><Link to="/" onClick={scrollTop}>Accueil</Link></li>
              <li><Link to="/movies" onClick={scrollTop}>Films</Link></li>
              <li><Link to="/series" onClick={scrollTop}>Séries</Link></li>
              <li><Link to="/favorites" onClick={scrollTop}>Mes favoris</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>À propos</h4>
            <p className="footer-about-text">
              Dataflix est une vitrine cinéma & séries alimentée en temps réel
              par l'API TMDB. Découvrez les tendances, les mieux notés et
              gérez vos favoris en un seul endroit.
            </p>
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noreferrer"
              className="footer-tmdb-badge"
            >
              <img
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                alt="TMDB Logo"
                height="14"
              />
            </a>
          </div>
        </nav>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} Dataflix. Tous droits réservés.
          </p>
          <p className="footer-disclaimer">
            Ce site n'est pas affilié à Netflix. Données fournies par <a href="https://www.themoviedb.org" target='_blank'>TMDB</a>.
          </p>
        </div>
      </div>
    </footer>
  )
}
