import axios from "axios"

export const getImages = async (tmdbId, id, dispatch, movie) => {
    const response = await axios.get(`https://api.themoviedb.org/3/${movie ? 'movie' : 'tv'}/${tmdbId.toString()}/images?api_key=6ba0d338722bb3a7b301fdb45104bfcd`);
    dispatch({ type: 'ADD_IMAGES', payload: {
        'id': id,
        'images': response.data,
    }});
    return response.data;
}

export const searchMulti = async (query, userdata, dispatch, state) => {
    const reponse1 = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=6ba0d338722bb3a7b301fdb45104bfcd&language=en-US&page=1&include_adult=false&query=${query}`)
    const reponse2 = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=6ba0d338722bb3a7b301fdb45104bfcd&language=en-US&page=2&include_adult=false&query=${query}`)
    
    return [...reponse1.data.results, ...reponse2.data.results];
}

export const getTmdbShow = async (tmdbId) => {
    const response = await axios.get(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=6ba0d338722bb3a7b301fdb45104bfcd`)
    return response.data;
}

export const getTmdbSeason = async (tmdbId, season) => {
    const response = await axios.get(`https://api.themoviedb.org/3/tv/${tmdbId}/season/${season}?api_key=6ba0d338722bb3a7b301fdb45104bfcd`)
    return response.data;
}