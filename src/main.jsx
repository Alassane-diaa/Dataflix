import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import {Header, Home} from './Home.jsx'
import Movies from './Movies.jsx'
import Series from './Series.jsx'
import Favorites from './Favorites.jsx'
import ItemPage from './ItemPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/series" element={<Series />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/:type/:id" element={<ItemPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
