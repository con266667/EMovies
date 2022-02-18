import axios from "axios";
import { getAllMoviesLink, getVHLink } from "./scrape";
import { getImages } from "./tmdb";
import Video from "./Video";

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

export const getTopMovies = async () => {
    return await getTmdbUrl('https://api.themoviedb.org/3/discover/movie?api_key=6ba0d338722bb3a7b301fdb45104bfcd', true);
}

export const getActionMovies = async () => {
   return await getMovieGenre(28);
}

export const getComedyMovies = async () => {
    return await getMovieGenre(35);
}

export const getActionShows = async () => {
    return await getShowGenre(10759);
 }
 
 export const getComedyShows = async () => {
     return await getShowGenre(35);
 }

const getMovieGenre = async (genre) => {
   return await getTmdbUrl(`https://api.themoviedb.org/3/discover/movie?api_key=6ba0d338722bb3a7b301fdb45104bfcd&with_genres=${genre}&release_date.lte=${new Date().getFullYear() - 1}&with_original_language=en`, true);
}

const getShowGenre = async (genre) => {
    return await getTmdbUrl(`https://api.themoviedb.org/3/discover/tv?api_key=6ba0d338722bb3a7b301fdb45104bfcd&with_genres=${genre}&with_original_language=en`, false);
}

const getVideoObject = async (data) => {
    var video = data['video'];
    var isMovie = data['isMovie'];
    var traktObject = await traktIdLookup(video.id, 'tmdb', isMovie);
    traktObject = traktObject[0];
    if (traktObject[isMovie ? 'movie' : 'show'] === undefined) {
        return null;
    }
    return new Video(
        (isMovie ? video.title : video.name), 
        ((isMovie ? video.release_date : video.first_air_date) ?? '').substring(0,4), 
        video.overview, 'https://image.tmdb.org/t/p/original' + video.poster_path, 
        'https://image.tmdb.org/t/p/original' + video.backdrop_path, 
        traktObject[isMovie ? 'movie' : 'show'].ids, 
        isMovie
    )
}

const getTmdbUrl = async (url, isMovie) => {
    const response = await axios.get(url);
    const movies = response.data['results'];
    const data = movies.map(movie => {
        return {
            'isMovie': isMovie,
            'video': movie
        }
    });

    return (await Promise.all(data.map(getVideoObject))).filter(v => v !== null);
}

const traktIdLookup = async (id, type, isMovie) => {
    const response = await axios.get(`https://api.trakt.tv/search?id_type=${type}&id=${id}&type=${isMovie ? 'movie' : 'show'}`, {
        headers: { 
            'trakt-api-key': api_key,
            'Content-Type': 'application/json',
        }
    });
    return response.data;
}

export const getMoviesWatched = async (userdata, dispatch, state) => {
    try {
        const response = await axios.get('https://api.trakt.tv/sync/history/movies', defaultConfig(userdata));
        return await storeVideoListData(response.data, dispatch, true, state);
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getPlayback = async (userdata, dispatch, state) => {
    const response = await axios.get('https://api.trakt.tv/sync/playback/shows', defaultConfig(userdata));

    dispatch({ type: 'UPDATE_WATCH_PROGRESS', payload: {'uuid': userdata.uuid, 'watchProgress': response.data} })
    await storeVideoListData(response.data.filter(video => video.type === 'movie'), true);
    await storeVideoListData(response.data.filter(video => video.type !== 'movie'), false);
    return response.data;
}

export const getRecentlyWatchedShows = async (userdata, dispatch) => {
    const response = await axios.get('https://api.trakt.tv/sync/playback/shows', defaultConfig(userdata));

    dispatch({ type: 'UPDATE_WATCH_PROGRESS', payload: {'uuid': userdata.uuid, 'watchProgress': response.data} })
    return await storeVideoListData(response.data.filter(video => video.type !== 'movie'), false);
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

export const getShowEpisode = async (traktid, season, episode, userdata, dispatch) => {
    const response = await axios.get(`https://api.trakt.tv/shows/${traktid}/seasons/${season}/episodes/${episode}`, defaultConfig(userdata));
    await getImages(response.data.ids.tmdb, response.data.ids.imdb, dispatch, false);
    return response.data;
}

export const getTopShows = async () => {
    return await getTmdbUrl('https://api.themoviedb.org/3/discover/tv?api_key=6ba0d338722bb3a7b301fdb45104bfcd', false);
}

export const getTrendingShows = async (userdata, dispatch, state) => {
    const response = await axios.get('https://api.trakt.tv/shows/trending', defaultConfig(userdata));
    return await storeVideoListData(response.data, dispatch, false, state);
}

export const getRecommendedShows = async (userdata, dispatch, state) => {
    const response = await axios.get('https://api.trakt.tv/shows/recommended', defaultConfig(userdata));
    return await storeVideoListData(response.data, dispatch, false, state);
}

export const getMostWatchedShows = async (userdata, dispatch, state) => {
    const response = await axios.get('https://api.trakt.tv/shows/watched', defaultConfig(userdata));
    return await storeVideoListData(response.data, dispatch, false, state);
}

export const getMovieRecommendations = async (userdata, dispatch, state) => {
    try {
        const response = await axios.get('https://api.trakt.tv/recommendations/movies', defaultConfig(userdata));
        return await storeVideoListData(response.data, dispatch, true, state);
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getTrendingMovies = async (userdata, dispatch, state) => {
    try {
        const response = await axios.get('https://api.trakt.tv/movies/trending', defaultConfig(userdata));
        return await storeVideoListData(response.data, dispatch, true, state);
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getPopularMovies = async (userdata, dispatch, state) => {
    try {
        const response = await axios.get('https://api.trakt.tv/movies/popular', defaultConfig(userdata));
        return await storeVideoListData(response.data, dispatch, true, state);
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getTop10BoxOffice = async (userdata, dispatch, state) => {
    try {
        const response = await axios.get('https://api.trakt.tv/movies/boxoffice', defaultConfig(userdata));
        return await storeVideoListData(response.data, dispatch, true, state);
    } catch (error) {
        console.log(error);
        return [];
    }
}

// export const getMovieGenre = async (genre, userdata, dispatch, state) => {
//     try {
//         const response = await axios.get('https://api.trakt.tv/movies/recommended?genres=' + genre, defaultConfig(userdata));
//         return await storeVideoListData(response.data, dispatch, true, state);
//     } catch (error) {
//         console.log(error);
//         return [];
//     }
// }

export const searchShow = async (title) => {
    const response = await axios.get(`https://api.trakt.tv/search/show?query=${title}`, {headers: { 
        'trakt-api-key': api_key,
        'Content-Type': 'application/json',
    }});
    return response.data;
}

const stripVideos = (videos) => {
    return videos.map(video => stripVideo(video));
}
    
const stripVideo = (video) => {
    var strippedVideo = video['movie'] === undefined ? video : video['movie'];
    strippedVideo = strippedVideo['show'] === undefined ? strippedVideo : video['show'];
    return strippedVideo;
}

const videoObjectFromTrakt = async (video, isMovie) => {
    var tmdbInfo = await getTmdbInfo(video.ids.tmdb, isMovie);
    return new Video(
        (isMovie ? tmdbInfo.title : tmdbInfo.name), 
        ((isMovie ? tmdbInfo.release_date : tmdbInfo.first_air_date) ?? '').substring(0,4), 
        tmdbInfo.overview, 
        'https://image.tmdb.org/t/p/original' + tmdbInfo.poster_path, 
        'https://image.tmdb.org/t/p/original' + tmdbInfo.backdrop_path, 
        video.ids, 
        isMovie
    )
}

const storeVideoListData = async (list, aremovies) => {
    var videos = stripVideos(list);
    videos = videos.filter((v,i,a)=>a.findIndex(t=>(t.ids.imdb===v.ids.imdb))===i);
    return Promise.all(videos.map(video => videoObjectFromTrakt(video, aremovies)));
}

const storeIsMovie = (video, ismovie, dispatch) => {
    dispatch({ type: 'ADD_IS_MOVIE', payload: {
        'id': video.ids.imdb,
        'isMovie': ismovie,
    }});
}

const getTmdbInfo = async (tmdbid, isMovie) => {
    const response = await axios.get(`https://api.themoviedb.org/3/${isMovie ? 'movie' : 'tv'}/${tmdbid}?api_key=6ba0d338722bb3a7b301fdb45104bfcd&language=en-US`);
    return response.data;
}

const getImagesFromVideo = async (video, dispatch, movie, state) => {
    if (state.videoInfo.videoInfo.images[video.ids.imdb] !== undefined) {
        return state.videoInfo.videoInfo.images[video.ids.imdb];
    }
    
    const images = await getImages(video['ids']['tmdb'], video['ids']['imdb'], dispatch, movie);
    return images;
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
    const response = await axios.post('https://api.trakt.tv/scrobble/start', logObject(traktObject, progress, movie, episode), config);
    return response.data;
}

export const logPause = async (userdata, traktObject, progress, movie, episode) => {
    const config = defaultConfig(userdata);
    const response = await axios.post('https://api.trakt.tv/scrobble/pause', logObject(traktObject, progress, movie, episode), config);
    return response.data;
}