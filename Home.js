import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMovieRecommendations, getMoviesWatched } from './Trakt';
import Page from './Page';
  

const Home = (props) => {
  const state = useSelector(state => state)
  const dispatch = useDispatch();

  const [lists, setLists] = useState([]);

  const currentUser = () => state.auth.auth.users.filter(user => user.uuid === state.auth.auth.currentUserUUID)[0];

  const isCached = (page) => {
    return !(
         state.auth.auth.lists[currentUser().uuid] === undefined
      || state.auth.auth.lists[currentUser().uuid][page] === undefined
      || state.auth.auth.lists[currentUser().uuid][page]["lists"] === undefined
      || state.auth.auth.lists[currentUser().uuid][page]["lists"].length === 0
      || ((Date.now() - state.auth.auth.lists[currentUser().uuid][page]["lastUpdated"]) > 3600000)
    )
  }

  useEffect(() => {
    const setup = async () => {
      console.log(state.auth.auth.lists[currentUser().uuid]);
      if (!isCached('home')) { 
          console.log(Date.now() - state.auth.auth.lists[currentUser().uuid]["home"]["lastUpdated"] );
          var moviesWatched = await getMoviesWatched(currentUser(), dispatch, state);
          var movieRecommendations = await getMovieRecommendations(currentUser(), dispatch, state);

          const lists = [
            {
              'title': 'Continue Watching',
              'items': moviesWatched
            },
            {
              'title': 'Recommended',
              'items': movieRecommendations
            }
          ]

          dispatch({ type: 'UPDATE_LISTS', payload: {
            lists: lists,
            page: 'home',
            uuid: currentUser().uuid
          }})

          setLists(_ => lists);
      } else {
        console.log("Using cached data");
        setLists(_ => state.auth.auth.lists[currentUser().uuid]["home"]["lists"]);
      }
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