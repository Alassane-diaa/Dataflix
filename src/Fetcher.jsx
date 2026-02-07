import { useState } from "react";

const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export const fetchHomeData = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
    }
  };

  try {
    const [trending, topRated, upcoming, popularSeries] = await Promise.all([
      fetch(`${import.meta.env.VITE_TMDB_BASE_URL}/trending/movie/week?language=fr-FR`, options).then(res => res.json()),
      fetch(`${import.meta.env.VITE_TMDB_BASE_URL}/movie/top_rated?language=fr-FR`, options).then(res => res.json()),
      fetch(`${import.meta.env.VITE_TMDB_BASE_URL}/movie/upcoming?language=fr-FR`, options).then(res => res.json()),
      fetch(`${import.meta.env.VITE_TMDB_BASE_URL}/tv/popular?language=fr-FR`, options).then(res => res.json()),
    ]);

    return {
      trending: trending.results,
      topRated: topRated.results,
      upcoming: upcoming.results,
      popularSeries: popularSeries.results
    };
  } catch (error) {
    console.error("Erreur Home Data:", error);
    return null;
  }
};

export const fetchMoviesData = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
    }
  };

  try {
    const [popular, topRated, nowPlaying, upcoming] = await Promise.all([
      fetch(`${import.meta.env.VITE_TMDB_BASE_URL}/movie/popular?language=fr-FR`, options).then(res => res.json()),
      fetch(`${import.meta.env.VITE_TMDB_BASE_URL}/movie/top_rated?language=fr-FR`, options).then(res => res.json()),
      fetch(`${import.meta.env.VITE_TMDB_BASE_URL}/movie/now_playing?language=fr-FR`, options).then(res => res.json()),
      fetch(`${import.meta.env.VITE_TMDB_BASE_URL}/movie/upcoming?language=fr-FR`, options).then(res => res.json()),
    ]);

    return {
      popular: popular.results,
      topRated: topRated.results,
      nowPlaying: nowPlaying.results,
      upcoming: upcoming.results
    };
  } catch (error) {
    console.error("Erreur Movies Data:", error);
    return null;
  }
};