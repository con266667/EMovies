import axios from 'axios';
import jssoup from 'jssoup';

export const trailerId = async (video) => {
    try {
        const imdbPage = await axios.get(`https://www.imdb.com/title/${video.ids.imdb}`);
        const i = imdbPage.data.indexOf('embedUrl');
        const path = imdbPage.data.substring(i+11, i+100).split('"')[0];
        const trailerPage = await axios.get(`https://www.imdb.com${path}`);
        const j = trailerPage.data.indexOf('video/mp4');
        const trailerUrl = trailerPage.data.substring(j+11, j+1000).split('"')[3].replace('\\', '');
        return trailerUrl;
    } catch (error) {
        return ''; 
    }
}
