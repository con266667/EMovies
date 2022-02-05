import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPlayback, getTrendingShows } from './Trakt';
import Page from './Page';
  

const Shows = (props) => {
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
      await getPlayback(currentUser(), dispatch, state);
      if (!isCached('tv')) {
        const trendingShows = await getTrendingShows(currentUser(), dispatch, state);

        const lists = [
          {
            'title': 'Continue Watching',
            'items': state.auth.auth.watchProgress[currentUser().uuid].filter(show => show.type === 'episode').filter((v,i,a)=>a.findIndex(t=>(t.show.ids.imdb===v.show.ids.imdb))===i)
          },
          {
              'title': 'Trending',
              'items': trendingShows
          },
        ]

        dispatch({ type: 'UPDATE_LISTS', payload: {
            lists: lists,
            page: 'tv',
            uuid: currentUser().uuid
        }});

        setLists(_ => lists);
      } else {
        setLists(_ => state.auth.auth.lists[currentUser().uuid]["tv"]["lists"]);
      }
    }

    if (lists.length === 0) {
     setup();
    }
  }, [setLists]);

  return (
    <Page lists={lists} {...props} />
  );
};

export default Shows;