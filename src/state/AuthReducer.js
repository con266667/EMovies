import { combineReducers } from 'redux';

const INITIAL_STATE = {
  user_tokens: [],
  users: [],
  currentUserUUID: '',
  playback: {},
  lists: {},
  watchProgress: {}
};

const listsDefault = {
  "home": {
    "lists": [],
    "lastUpdated": 0
  },
  "tv": {
    "lists": [],
    "lastUpdated": 0
  },
  "movies": {
    "lists": [],
    "lastUpdated": 0
  },
}

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_USER':
        return Object.assign({}, state, {
            user_tokens: [...state.user_tokens, action.payload]
        })
    case 'ADD_USER_DATA':
      newstate = Object.assign({}, state)
      if (state.users.filter(user => user.uuid === action.payload.uuid).length !== 0) {
        newstate.remove(user => user.uuid === action.payload.uuid);
      }
      return Object.assign({}, newstate, {
        users: [...newstate.users, action.payload]
      });
    case 'ADD_MOVIES_WATCHED':
      updatedUser = state.users.filter(user => user.uuid === action.payload.uuid)[0];
      updatedUser.moviesWatched = action.payload.moviesWatched;
      return Object.assign({}, state, {
        users: [...state.users.filter(user => user.uuid !== action.payload.uuid), updatedUser]
      });
    case 'SET_CURRENT_USER':
      return Object.assign({}, state, {
        currentUserUUID: action.payload
      });
    case 'SET_PLAYBACK':
      newstate = Object.assign({}, state);
      newstate.playback[action.payload.uuid] = action.payload.playback;
      return Object.assign({}, newstate, {
        playback: newstate.playback
      });
    case 'UPDATE_LISTS':
      newstate = Object.assign({}, state);
      if (newstate[action.payload.uuid] === undefined) {
        newstate.lists[action.payload.uuid] = listsDefault;
      }
      newstate.lists[action.payload.uuid][action.payload.page]['lists'] = action.payload.lists;
      newstate.lists[action.payload.uuid][action.payload.page]['lastUpdated'] = Date.now();
      return Object.assign({}, newstate, {
        lists: newstate.lists
      });
    case 'UPDATE_WATCH_PROGRESS':
      newstate = Object.assign({}, state);
      newstate.watchProgress[action.payload.uuid] = action.payload.watchProgress;
      return Object.assign({}, newstate, {
        watchProgress: newstate.watchProgress
      });
    default:
      return state
  }
};

export default combineReducers({
  auth: authReducer
});