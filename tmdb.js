import axios from "axios"

export const getImages = async (tmdbId, traktId, dispatch, movie) => {
    const response = await axios.get(`https://api.themoviedb.org/3/${movie ? 'movie' : 'tv'}/${tmdbId.toString()}/images?api_key=6ba0d338722bb3a7b301fdb45104bfcd`);
    dispatch({ type: 'ADD_IMAGES', payload: {
        'id': traktId,
        'images': response.data,
    }});
    return response.data;
}