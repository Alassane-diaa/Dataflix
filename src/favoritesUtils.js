// Get all favorites from localStorage
export const getFavorites = () => {
  const stored = localStorage.getItem('dataflix_favorites');
  return stored ? JSON.parse(stored) : [];
};

// Check if an item is favorited
export const isFavorited = (type, id) => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.type === type && fav.id === parseInt(id));
};

// Add item to favorites
export const addFavorite = (type, id, title, posterPath) => {
  const favorites = getFavorites();
  
  // Check if already exists
  if (isFavorited(type, id)) {
    return favorites;
  }
  
  const newFavorite = {
    type,
    id: parseInt(id),
    title,
    posterPath,
    addedAt: new Date().toISOString()
  };
  
  favorites.push(newFavorite);
  localStorage.setItem('dataflix_favorites', JSON.stringify(favorites));
  return favorites;
};

// Remove item from favorites
export const removeFavorite = (type, id) => {
  const favorites = getFavorites();
  const filtered = favorites.filter(fav => !(fav.type === type && fav.id === parseInt(id)));
  localStorage.setItem('dataflix_favorites', JSON.stringify(filtered));
  return filtered;
};

// Toggle favorite
export const toggleFavorite = (type, id, title, posterPath) => {
  if (isFavorited(type, id)) {
    return removeFavorite(type, id);
  } else {
    return addFavorite(type, id, title, posterPath);
  }
};
