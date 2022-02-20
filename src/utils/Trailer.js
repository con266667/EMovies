import axios from 'axios';

export const trailerId = async (video) => {
    const response = await axios.get(`https://api.themoviedb.org/3/${video.isMovie ? 'movie' : 'tv'}/${video.ids.tmdb}/videos?api_key=6ba0d338722bb3a7b301fdb45104bfcd`);
    return response.data.results.find(result => result.type === 'Trailer').key;
}