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

export const fetchSeriesData = async () => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
    }
  };

  try {
    const [popular, topRated, airingToday, onTheAir] = await Promise.all([
      fetch(`${import.meta.env.VITE_TMDB_BASE_URL}/tv/popular?language=fr-FR`, options).then(res => res.json()),
      fetch(`${import.meta.env.VITE_TMDB_BASE_URL}/tv/top_rated?language=fr-FR`, options).then(res => res.json()),
      fetch(`${import.meta.env.VITE_TMDB_BASE_URL}/tv/airing_today?language=fr-FR`, options).then(res => res.json()),
      fetch(`${import.meta.env.VITE_TMDB_BASE_URL}/tv/on_the_air?language=fr-FR`, options).then(res => res.json()),
    ]);

    return {
      popular: popular.results,
      topRated: topRated.results,
      airingToday: airingToday.results,
      onTheAir: onTheAir.results
    };
  } catch (error) {
    console.error("Erreur Series Data:", error);
    return null;
  }
};

export const fetchItemDetails = async (type, id) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
    }
  };

  try {
    const endpoint = type === 'movie' ? 'movie' : 'tv';
    const response = await fetch(
      `${import.meta.env.VITE_TMDB_BASE_URL}/${endpoint}/${id}?language=fr-FR&append_to_response=credits`,
      options
    );
    
    if (!response.ok) {
      throw new Error('Item not found');
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur Item Details:", error);
    return null;
  }
};