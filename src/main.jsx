import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './styles/global.css'
import './styles/shared.css'
import Home from './App.jsx'
import Header from './components/Header.jsx'
import BrowsePage from './features/browse/BrowsePage.jsx'
import Favorites from './features/favorites/Favorites.jsx'
import ItemPage from './features/itemPage/ItemPage.jsx'
import SearchResults from './features/search/SearchResults.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<BrowsePage mediaType="movie" />} />
        <Route path="/series" element={<BrowsePage mediaType="tv" />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/:type/:id" element={<ItemPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
