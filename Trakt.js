import axios from "axios";
import { getAllMoviesLink, getVHLink } from "./scrape";
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

export const getMoviesWatched = async (userdata, dispatch, state) => {
    const response = await axios.get('https://api.trakt.tv/sync/history/movies', defaultConfig(userdata));
    return await storeVideoListData(response.data, dispatch, true, state);
}

export const getPlayback = async (userdata, dispatch, state) => {
    const response = await axios.get('https://api.trakt.tv/sync/playback/shows', defaultConfig(userdata));

    dispatch({ type: 'SET_PLAYBACK', payload: {'uuid': userdata.uuid, 'playback': response.data} })
    return await storeVideoListData(response.data, dispatch, false, state);
}

export const getShowEpisodes = async (traktid, dispatch) => {
    const response = await axios.get('https://api.trakt.tv/shows/' + traktid + '/seasons?extended=episodes', {
        headers: { 
            'trakt-api-key': api_key,
            'Content-Type': 'application/json',
        }
    });

    // dispatch({ type: 'ADD_SEASONS', payload: {'traktid': traktid, 'seasons': response.data} });
    return response.data;
}

export const getTrendingShows = async (userdata, dispatch, state) => {
    const response = await axios.get('https://api.trakt.tv/shows/trending', defaultConfig(userdata));
    return await storeVideoListData(response.data, dispatch, false, state);
}

export const getMovieRecommendations = async (userdata, dispatch, state) => {
    const response = await axios.get('https://api.trakt.tv/recommendations/movies', defaultConfig(userdata));
    return await storeVideoListData(response.data, dispatch, true, state);
}

const traktShowsToObjectList = async (data, dispatch) => {
    var shows;
    if (data[0].show !== undefined) {
        shows = data.map(show => show.show);
    } else {
        shows = data;
    }
    shows = shows.filter((value, index, self) => self.findIndex(show => show.title === value.title) === index);
    const showsArray = [];

    for (const show of shows) {
        showsArray.push(await traktShowToObject(show, dispatch));
    }

    return showsArray;
}

const traktShowToObject = async (show, dispatch) => {
    const _images = await getImages(show.ids.tmdb, show.ids.trakt, dispatch, false);
    const background = 'https://image.tmdb.org/t/p/original' + 
        (_images['backdrops'].length > 0 ? _images['backdrops'][0].file_path : _images['posters'][0].file_path);
    
    dispatch({ type: 'UPDATE_SHOW', payload: {
        'id': show.ids.trakt,
        'title': show.title,
        'year': show.year,
        'image': background,
        'images': _images,
        'traktObject': show
    }});

    return {
        title: show.title,
        year: show.year,
        image: background,
        movie: false
    };
}

const traktMoviesToObjectList = async (data, dispatch) => {
    var movies;
    if (data[0].movie !== undefined) {
        movies = data.map(movie => movie.movie);
    } else {
        movies = data;
    }
    movies = movies.filter((value, index, self) => self.findIndex(movie => movie.title === value.title) === index);
    const moviesArray = [];

    for (const movie of movies) {
        moviesArray.push(await traktMovieToObject(movie, dispatch));
    }

    return moviesArray;
}

const traktMovieToObject = async (movie, dispatch) => {
    const _images = await getImages(movie.ids.tmdb, movie.ids.trakt, dispatch, true);
    const background = 'https://image.tmdb.org/t/p/original/' + _images['backdrops'][0].file_path;

    dispatch({ type: 'UPDATE_MOVIE', payload: {
        'id': movie.ids.trakt,
        'title': movie.title,
        'year': movie.year,
        'image': background,
        'images': _images,
        'traktObject': movie
    }});

    return movie;
}

const stripVideos = (videos) => {
    return videos.map(video => stripVideo(video));
}
    
const stripVideo = (video) => {
    var strippedVideo = video['movie'] === undefined ? video : video['movie'];
    strippedVideo = strippedVideo['show'] === undefined ? strippedVideo : video['show'];
    return strippedVideo;
}

const storeVideoListData = async (list, dispatch, aremovies, state) => {
    var videos = stripVideos(list);
    videos = videos.filter((v,i,a)=>a.findIndex(t=>(t.ids.trakt===v.ids.trakt))===i)
    for (const video of videos) {
        storeIsMovie(video, aremovies, dispatch);
        await getImagesFromVideo(video, dispatch, aremovies, state);
    }

    return videos;
}

const storeIsMovie = (video, ismovie, dispatch) => {
    dispatch({ type: 'ADD_IS_MOVIE', payload: {
        'id': video.ids.trakt,
        'isMovie': ismovie,
    }});
}

const getImagesFromVideo = async (video, dispatch, movie, state) => {
    if (state.videoInfo.videoInfo.images[video.ids.trakt] !== undefined) {
        return state.videoInfo.videoInfo.images[video.ids.trakt];
    }

    return await getImages(video['ids']['tmdb'], video['ids']['trakt'], dispatch, movie);
}

const logObject = (traktObject, progress, movie, episode) => {
    return movie ? {
        "movie": traktObject,
        "progress": progress * 100,
        "app_version": "1.0.0",
        "app_date": "2022-01-01",
    } : {
        "episode": episode,
        "show": traktObject,
        "progress": progress * 100,
        "app_version": "1.0.0",
        "app_date": "2022-01-01",
    }
}

export const logPlay = async (userdata, traktObject, progress, movie, episode) => {
    const config = defaultConfig(userdata);
    console.log(traktObject);
    const response = await axios.post('https://api.trakt.tv/scrobble/start', logObject(traktObject, progress, movie, episode), config);
    return response;
}

export const logPause = async (userdata, traktObject, progress, movie, episode) => {
    const config = defaultConfig(userdata);
    console.log(traktObject);

    const response = await axios.post('https://api.trakt.tv/scrobble/pause', logObject(traktObject, progress, movie, episode), config);
    return response;
}