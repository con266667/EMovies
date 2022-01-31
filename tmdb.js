import axios from "axios"

export const getImages = async (tmdbId) => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId.toString()}/images?api_key=6ba0d338722bb3a7b301fdb45104bfcd`);
    return response.data;
}