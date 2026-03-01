# Dataflix

Application web de découverte de films et séries, alimentée par l'API [TMDB](https://www.themoviedb.org/).

---

## Fonctionnalités

- Carrousel de films tendance sur la page d'accueil
- Pages Films et Séries avec filtres par genre, acteur et tri
- Page de détail pour chaque film/série : synopsis, casting, bande-annonce YouTube, films/séries similaires, budget/box-office
- Recherche avec filtres
- Gestion des favoris

## Configuration

Créez un fichier `.env` à la racine ou juste renommez le fichier `.env.example` en renseignant:
```env
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_TOKEN=votre_token_api_tmdb
```

Le token est disponible sur [themoviedb.org](https://www.themoviedb.org/settings/api) (section *API Read Access Token*).

Puis pour run en local : 

```bash
npm install

# Développement
npm run dev

# Build
npm run build
npm run preview
```

## Structure du projet

```
src/
├── App.jsx              # Page d'accueil
├── components/          # Header, Footer, ItemCard, FilterPanel
├── features/
│   ├── browse/          # Page Films / Séries
│   ├── favorites/       # Page Mes favoris
│   ├── itemPage/        # Page de détail
│   └── search/          # Résultats de recherche
├── services/
│   └── Fetcher.js       # Toutes les requêtes TMDB
└── styles/              # CSS global
```

---

Ce projet utilise l'API TMDB mais n'est pas approuvé ni certifié par TMDB.
