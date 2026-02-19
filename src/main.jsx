import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './App.jsx'
import Header from './components/Header.jsx'
import Movies from './features/movies/Movies.jsx'
import Series from './features/series/Series.jsx'
import Favorites from './features/favorites/Favorites.jsx'
import ItemPage from './features/itemPage/ItemPage.jsx'
import SearchResults from './features/search/SearchResults.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/series" element={<Series />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/:type/:id" element={<ItemPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
