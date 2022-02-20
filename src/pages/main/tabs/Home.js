import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getActionMovies, getComedyMovies, getTopMovies } from '../../../utils/Trakt';
import Page from '../components/Page';
  

const Home = (props) => {
  const state = useSelector(state => state)
  const dispatch = useDispatch();

  const [lists, setLists] = useState([]);

  const currentUser = () => state.auth.auth.users.filter(user => user.uuid === state.auth.auth.currentUserUUID)[0];

  const isCached = (page) => {
    return false;
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
      if (!isCached('home')) { 
          var trendingMovies = await getTopMovies();
          var actionMovies = await getActionMovies();
          var comedyMovies = await getComedyMovies();

          const lists = [
            {
              'title': 'Trending',
              'items': trendingMovies
            },
            {
              'title': 'Action',
              'items': actionMovies
            },
            {
              'title': 'Comedy',
              'items': comedyMovies
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