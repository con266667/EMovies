import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMovieRecommendations, getMoviesWatched } from './Trakt';
import Page from './Page';
  

const Home = (props) => {
  const state = useSelector(state => state)
  const dispatch = useDispatch();

  const [lists, setLists] = useState([]);

  const currentUser = () => state.auth.auth.users.filter(user => user.uuid === state.auth.auth.currentUserUUID)[0];

  useEffect(() => {
    const setup = async () => {
      var moviesWatched = await getMoviesWatched(currentUser(), dispatch, state);
      var movieRecommendations = await getMovieRecommendations(currentUser(), dispatch, state);

      setLists(_ => [
        {
          'title': 'Continue Watching',
          'items': moviesWatched
        },
        {
          'title': 'Recommended',
          'items': movieRecommendations
        }
      ]);
    }

    if (lists.length === 0) {
     setup();
    }
  }, [setLists]);

  return (
    <Page lists={lists} {...props}></Page>
  );
};

export default Home;