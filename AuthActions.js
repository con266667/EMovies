export const addToken = newToken => (
    {
      type: 'ADD_USER',
      payload: newToken,
    }
);

export const addUserData = newUserData => (
  {
    type: 'ADD_USER_DATA',
    payload: newUserData,
  }
);

// export const addMoviesWatched = moviesWatched => (
//   {
//     type: 'ADD_MOVIED_WATCHED',
//     payload: moviesWatched,
//   }
// );