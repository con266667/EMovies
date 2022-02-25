import axios from "axios";
import { getImages } from "./tmdb";
import Video from "../classes/Video";

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

export const getRecentlyWatchedVideos = async (userdata, dispatch) => {
    const response = await axios.get('https://api.trakt.tv/sync/playback', defaultConfig(userdata));
    dispatch({ type: 'UPDATE_WATCH_PROGRESS', payload: {'uuid': userdata.uuid, 'watchProgress': response.data} })
    movies = await storeVideoListData(response.data.filter(video => video.type === 'movie'), true);
    shows = await storeVideoListData(response.data.filter(video => video.type !== 'movie'), false);
    return [...movies, ...shows];
}

export const getRecomededVideos = async (userdata, dispatch) => {
    const moviesRepsonse = await axios.get('https://api.trakt.tv/recommendations/movies', defaultConfig(userdata));
    const showsResponse = await axios.get('https://api.trakt.tv/recommendations/shows', defaultConfig(userdata));
    movies = await storeVideoListData(moviesRepsonse.data, true);
    shows = await storeVideoListData(showsResponse.data, false);
    return [...movies, ...shows];
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

const getTmdbInfo = async (tmdbid, isMovie) => {
    const response = await axios.get(`https://api.themoviedb.org/3/${isMovie ? 'movie' : 'tv'}/${tmdbid}?api_key=6ba0d338722bb3a7b301fdb45104bfcd&language=en-US`);
    return response.data;
}

const logObject = (video, progress) => {
    return video.isMovie ? {
        "movie": {
            "ids": video.ids
        },
        "progress": progress * 100,
        "app_version": "1.0.0",
        "app_date": "2022-01-01",
    } : {
        "episode": {
            "number": video.episode,
            "season": video.season,
        },
        "show": {
            "ids": video.ids
        },
        "progress": progress * 100,
        "app_version": "1.0.0",
        "app_date": "2022-01-01",
    }
}

export const logPlay = async (userdata, video, progress) => {
    const config = defaultConfig(userdata);
    const response = await axios.post('https://api.trakt.tv/scrobble/start', logObject(video, progress), config);
    return response.data;
}

export const logPause = async (userdata, video, progress) => {
    const config = defaultConfig(userdata);
    const response = await axios.post('https://api.trakt.tv/scrobble/pause', logObject(video, progress), config);
    return response.data;
}