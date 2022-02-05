import { combineReducers } from 'redux';

const INITIAL_STATE = {
  movies: [],
  shows: [],
  images: {},
  streams: {},
  isMovie: {}
};

const videoInfoReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_MOVIE':
        newstate = Object.assign({}, state)
        newstate.movies = newstate.movies.filter(movie => !(movie.title === action.payload.title && movie.year === action.payload.year));
        return Object.assign({}, newstate, {
            movies: [...newstate.movies, action.payload]
        });
    case 'UPDATE_SHOW':
        newstate = Object.assign({}, state)
        newstate.shows = newstate.shows.filter(show => !(show.title === action.payload.title && show.year === action.payload.year));
        return Object.assign({}, newstate, {
            shows: [...newstate.shows, action.payload]
        });
    case 'ADD_SEASONS':
        newstate = Object.assign({}, state)
        updatedShow = newstate.shows.filter(show => show.traktObject.ids.trakt === action.payload.traktid)[0];
        updatedShow['seasons'] = action.payload.seasons;
        newstate = newstate.shows.filter(show => show.traktObject.ids.trakt !== action.payload.traktid);
        var shows = [...newstate, updatedShow];
        return Object.assign({}, newstate, {
            shows: shows
        });
    case 'ADD_IMAGES':
        newstate = Object.assign({}, state)
        newstate.images[action.payload.id] = action.payload.images;
        return Object.assign({}, newstate, {
            images: newstate.images
        });
    case 'ADD_IS_MOVIE':
        newstate = Object.assign({}, state)
        newstate.isMovie[action.payload.id] = action.payload.isMovie;
        return Object.assign({}, newstate, {
            isMovie: newstate.isMovie
        });
    default:
      return state
  }
};

export default combineReducers({
  videoInfo: videoInfoReducer
});