import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTrendingShows } from './Trakt';
import Page from './Page';
  

const Shows = (props) => {
  const state = useSelector(state => state)
  const dispatch = useDispatch();

  const [lists, setLists] = useState([]);

  const currentUser = () => state.auth.auth.users.filter(user => user.uuid === state.auth.auth.currentUserUUID)[0];

  useEffect(() => {
    const setup = async () => {

      const trendingShows = await getTrendingShows(currentUser(), dispatch, state);

    //   var continueWatching = state.auth.auth.playback[state.auth.auth.currentUserUUID].filter(show => show.type === 'episode');

    //   continueWatching = continueWatching.map(show =>
    //      ({
    //         'title': show.show.title,
    //         'year': show.show.year,
    //         'image': state.videoInfo.videoInfo.shows.filter(_show => _show.title === show.show.title && _show.year === show.show.year)[0].image,
    //         'progress': show.progress,
    //      })
    //   ).filter((value, index, self) => self.findIndex(show => show.title === value.title) === index);

      setLists(_ => [
        // {
        //     'title': 'Continue Watching',
        //     'items': continueWatching
        // },
        {
          'title': 'Trending',
          'items': trendingShows
        }
      ]);
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