import { combineReducers } from 'redux';

const INITIAL_STATE = {
  user_tokens: [],
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_USER':
        return Object.assign({}, state, {
            user_tokens: [...state.user_tokens, action.payload]
        })
    default:
      return state
  }
};

export default combineReducers({
  auth: authReducer
});