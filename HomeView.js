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
 import { Dimensions, View } from 'react-native';
 
  
 
 const HomeView = (props) => {
     switch(props.page) {
         case 'Home':
            return (
                <Home
                    width={Dimensions.get('window').width - 68} 
                    openVideo={props.openVideo} 
                    sideRef={props.sideRef} />
            )
         case 'Movie':
             return (<View />)
         case 'TV Show':
             return (<View />)
     }
     return (<View></View>)
 }
 
 export default HomeView;
 