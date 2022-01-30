/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import { Provider, useSelector } from 'react-redux';
 import { createStore } from 'redux';
 import PageReducer from './PageReducer';
 import { Navigation } from 'react-native-navigation';
 import Header from './Header';
 import Home from './Home';
 import MoviePage from './MoviePage';
 import { View } from 'react-native';
 
  
 
 const HomeView = () => {
    const state = useSelector(state => state)
     switch(state.page.page) {
         case 'For You':
             return (<Home />)
         case 'Movie':
             return (<View />)
         case 'TV Show':
             return (<View></View>)
     }
     return (<View></View>)
 }
 
 export default HomeView;
 