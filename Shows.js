import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getActionShows, getComedyShows, getPlayback, getRecentlyWatchedShows, getTopShows } from './Trakt';
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
      || ((Date.now() - state.auth.auth.lists[currentUser().uuid][page]["lastUpdated"]) > 36000)
    )
  }

  useEffect(() => {
    const setup = async () => {
      const playback = await getPlayback(currentUser(), dispatch, state);
      if (!isCached('tv')) {
        // const trendingShows = await getTrendingShows(currentUser(), dispatch, state);
        // const recommendedShows = await getRecommendedShows(currentUser(), dispatch, state);
        // const mostWatched = await getMostWatchedShows(currentUser(), dispatch, state);
        const recentlyWatchedShows = await getRecentlyWatchedShows(currentUser(), dispatch);
        const topShows = await getTopShows();
        const actionShows = await getActionShows();
        const comedyShows = await getComedyShows();

        const lists = [
          {
            'title': 'Recently Watched',
            'items': recentlyWatchedShows
          },
          {
            'title': 'Top Shows',
            'items': topShows
          },
          {
            'title': 'Action',
            'items': actionShows
          },
          {
            'title': 'Comedy',
            'items': comedyShows
          }
          // {
          //   'title': 'Continue Watching',
          //   'items': state.auth.auth.watchProgress[currentUser().uuid].filter(show => show.type === 'episode').sort((a,b) => Date(b.paused_at) - Date(a.paused_at)).filter((v,i,a)=>a.findIndex(t=>(t.show.ids.imdb===v.show.ids.imdb))===i).sort((a,b) => Date(a.paused_at) - Date(b.paused_at))
          // },
          // {
          //     'title': 'Trending',
          //     'items': trendingShows
          // },
          // {
          //   'title': 'Recommended',
          //   'items': recommendedShows   
          // },
          // {
          //   'title': 'Most Watched',
          //   'items': mostWatched
          // },
        ]

        // console.log(props.lists.map(list => list.items.map(item => item.show)));     

        dispatch({ type: 'UPDATE_LISTS', payload: {
            lists: lists,
            page: 'tv',
            uuid: currentUser().uuid
        }});

        setLists(_ => lists);
      } else {
        setLists(_ => [
          {
            'title': 'Continue Watching',
            'items': playback.filter(show => show.type === 'episode').sort((a,b) => Date(b.paused_at) - Date(a.paused_at)).filter((v,i,a)=>a.findIndex(t=>(t.show.ids.imdb===v.show.ids.imdb))===i).sort((a,b) => Date(a.paused_at) - Date(b.paused_at))
          },
          {
              'title': 'Trending',
              'items': state.auth.auth.lists[currentUser().uuid]["tv"]["lists"].filter(list => list.title === 'Trending')[0].items
          },
        ]);

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