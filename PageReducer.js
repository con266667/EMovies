import { combineReducers } from 'redux';

const INITIAL_STATE = {
  page: 'home',
};

const pageReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CHANGE_PAGE':
        return Object.assign({}, state, {
            page: action.payload
        })
    default:
      return state
  }
};

export default combineReducers({
  page: pageReducer
});