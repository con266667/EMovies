import { combineReducers } from 'redux';

const INITIAL_STATE = {
  user_tokens: [],
  users: [],
  currentUserUUID: '',
  playback: {}
};

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
    default:
      return state
  }
};

export default combineReducers({
  auth: authReducer
});