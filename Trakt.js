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
    await storeVideoListData(response.data.filter(video => video.type === 'movie'), dispatch, true, state);
    await storeVideoListData(response.data.filter(video => video.type !== 'movie'), dispatch, false, state);
    return response.data;
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

export const getTrendingShows = async (userdata, dispatch, state) => {
    const response = await axios.get('https://api.trakt.tv/shows/trending', defaultConfig(userdata));
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

export const searchShow = async (title) => {
    console.log(title);
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

const storeVideoListData = async (list, dispatch, aremovies, state) => {
    var videos = stripVideos(list);
    videos = videos.filter((v,i,a)=>a.findIndex(t=>(t.ids.imdb===v.ids.imdb))===i);
    for (const video of videos) {
        storeIsMovie(video, aremovies, dispatch);
        await getImagesFromVideo(video, dispatch, aremovies, state);
    }

    return videos;
}

const storeIsMovie = (video, ismovie, dispatch) => {
    dispatch({ type: 'ADD_IS_MOVIE', payload: {
        'id': video.ids.imdb,
        'isMovie': ismovie,
    }});
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
    console.log(progress);
    const response = await axios.post('https://api.trakt.tv/scrobble/start', logObject(traktObject, progress, movie, episode), config);
    return response.data;
}

export const logPause = async (userdata, traktObject, progress, movie, episode) => {
    const config = defaultConfig(userdata);
    const response = await axios.post('https://api.trakt.tv/scrobble/pause', logObject(traktObject, progress, movie, episode), config);
    console.log(response.data);
    return response.data;
}