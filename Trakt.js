import axios from "axios";

const api_key = 'bd40bc484afbea19226a29277101fe86a25269479697e2e959cb3a3d25a8f819';

export const getMoviesWatched = async (userdata, dispatch) => {
    const pushMoviesWatched = (uuid, moviesWatched) => dispatch({ type: 'ADD_MOVIES_WATCHED', payload: {'uuid': uuid, 'moviesWatched': moviesWatched} })

    console.log(userdata)

    const config = {
        headers: { 
            Authorization: `Bearer ${userdata['token']}`,
            'trakt-api-key': api_key,
            'Content-Type': 'application/json',
        }
    };

    const response = await axios.get('https://api.trakt.tv/sync/history/movies', config);
    pushMoviesWatched(userdata['uuid'], response.data);
    return response.data;
}