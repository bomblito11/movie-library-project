'use strict';

import axios from 'axios';

const moviesContainer = document.querySelector('.covers-container');

const genresList = {};

const getGenres = async url => {
  const response = await axios.get(url);
  const responseArray = await response.data.genres;

  await responseArray.map(genre => {
    genresList[`${genre['id']}`] = genre.name;
  });

  return genresList;
};

//Getting genres
getGenres(
  'https://api.themoviedb.org/3/genre/movie/list?api_key=ac2189c49864b4ab99e8ac3560f99981&language=en-US'
).then(
  getGenres(
    'https://api.themoviedb.org/3/genre/tv/list?api_key=ac2189c49864b4ab99e8ac3560f99981&language=en-US'
  )
);

const getMovies = async url => {
  const response = await axios.get(url);
  const moviesArray = await response.data.results;

  return moviesArray;
};

const listBuilder = moviesArray => {
  moviesArray.forEach(elem => {
    //Creating container and class for general movie info (cover, title, genres etc.)
    const movieCoverFigure = document.createElement('figure');
    movieCoverFigure.classList.add('cover__container');

    //Creating img tag for movie cover
    const coverImg = document.createElement('img');
    coverImg.classList.add('cover__image');
    coverImg.setAttribute(
      'src',
      `https://image.tmdb.org/t/p/w500${elem['poster_path']}`
    );
    coverImg.setAttribute('alt', elem['original_title']);
    coverImg.setAttribute('loading', 'lazy');

    //Creating figcaption (container for title, genres etc.)
    const coverFigcaption = document.createElement('figcaption');
    coverFigcaption.classList.add('cover__figcaption');

    //Header for movie title
    const movieTitle = document.createElement('h3');
    movieTitle.classList.add('cover__figcaption-title');

    if (elem['name']) {
      movieTitle.innerHTML = elem['name'];
    } else if (elem['original_name']) {
      movieTitle.innerHTML = elem['original_name'];
    } else {
      movieTitle.innerHTML = elem['original_title'];
    }

    //Tag for movie data (genres, release date)
    const movieData = document.createElement('p');
    movieData.classList.add('cover__figcaption-movie-data');

    const movieGenresArray = [];

    for (const id of elem['genre_ids']) {
      movieGenresArray.push(genresList[`${id}`]);
    }

    const releaseDate = new Date(
      `${elem['release_date'] || elem['first_air_date']}`
    );

    movieData.innerHTML = `${movieGenresArray.join(
      ', '
    )} | ${releaseDate.getFullYear()}`;

    coverFigcaption.append(movieTitle);
    coverFigcaption.append(movieData);
    movieCoverFigure.append(coverImg);
    movieCoverFigure.append(coverFigcaption);
    moviesContainer.append(movieCoverFigure);
  });
};

getMovies(
  'https://api.themoviedb.org/3/trending/all/week?api_key=ac2189c49864b4ab99e8ac3560f99981'
).then(response => {
  listBuilder(response);
});

export { listBuilder, getMovies, getGenres };