import axios from "axios";
import { getVHLink } from "./scrape";
import { getImages } from "./tmdb";

const api_key = 'bd40bc484afbea19226a29277101fe86a25269479697e2e959cb3a3d25a8f819';

const defaultConfig = (userdata) => {
    return {
        headers: { 
            Authorization: `Bearer ${userdata['token']}`,
            'trakt-api-key': api_key,
            'Content-Type': 'application/json',
        }
    };
}

export const getMoviesWatched = async (userdata, dispatch) => {
    const pushMoviesWatched = (uuid, moviesWatched) => dispatch({ type: 'ADD_MOVIES_WATCHED', payload: {'uuid': uuid, 'moviesWatched': moviesWatched} })

    const response = await axios.get('https://api.trakt.tv/sync/history/movies', defaultConfig(userdata));
    const moviesWatchedArray = await traktMoviesToObjectList(response.data);

    pushMoviesWatched(userdata['uuid'], moviesWatchedArray);
    return moviesWatchedArray;
}

export const getMovieRecommendations = async (userdata, dispatch) => {
    const pushMovieRecommendations = (uuid, movieRecommendations) => dispatch({ type: 'ADD_MOVIE_RECOMMENDATIONS', payload: {'uuid': uuid, 'movieRecommendations': movieRecommendations} })

    const response = await axios.get('https://api.trakt.tv/recommendations/movies', defaultConfig(userdata));
    const movieRecommendationsArray = await traktMoviesToObjectList(response.data);

    return movieRecommendationsArray;
}

const traktMoviesToObjectList = async (data) => {
    var movies;
    if (data[0].movie !== undefined) {
        movies = data.map(movie => movie.movie);
    } else {
        movies = data;
    }
    movies = movies.filter((value, index, self) => self.findIndex(movie => movie.title === value.title) === index);
    const moviesArray = [];

    for (const movie of movies) {
        moviesArray.push(await traktMovieToObject(movie));
    }

    return moviesArray;
}

const traktMovieToObject = async (movie) => {
    const _images = await getImages(movie.ids.tmdb);
    const _link = await getVHLink(movie.title, movie.year);
    const background = 'https://image.tmdb.org/t/p/original/' + _images['backdrops'][0].file_path;
    return {
        title: movie.title,
        year: movie.year,
        image: background,
        vhlink: _link
    };
}