import { useState } from "react";

const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export const fetchTrending = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_TOKEN}`
    }
  };

  try {
    const response = await fetch(`${TMDB_BASE_URL}/trending/movie/week?language=fr-FR`, options);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Données reçues:", data);
    return data.results;
  } catch (error) {
    console.error("Erreur lors du fetch trending:", error);
    return []; 
  }

};