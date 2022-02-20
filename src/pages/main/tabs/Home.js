import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getActionMovies, getComedyMovies, getTopMovies } from '../../../utils/Trakt';
import Page from '../components/Page';
  

const Home = (props) => {
  const state = useSelector(state => state)

  return (
    <Page lists={state.auth.auth.lists[state.auth.auth.currentUserUUID]['home']['lists']} {...props}/>
  );
};

export default Home;