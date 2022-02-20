import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getActionShows, getComedyShows, getPlayback, getRecentlyWatchedShows, getTopShows } from '../../../utils/Trakt';
import Page from '../components/Page';
  

const Shows = (props) => {
  const state = useSelector(state => state)

  return (
    <Page lists={state.auth.auth.lists[state.auth.auth.currentUserUUID]['tv']['lists']} {...props}/>
  );
};

export default Shows;