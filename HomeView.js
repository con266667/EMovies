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
import Shows from './Shows';
import Search from './Search';


const HomeView = (props) => {
    switch(props.page) {
        case 'Home':
            return (
                <Home
                    width={Dimensions.get('window').width - 68} 
                    openVideo={props.openVideo} 
                    openShow={props.openShow}
                    sideRef={props.homeRef} 
                />)
        case 'Movie':
            return (<View />)
        case 'TV':
            return (
                <Shows
                    width={Dimensions.get('window').width - 68} 
                    openVideo={props.openVideo} 
                    openShow={props.openShow}
                    sideRef={props.tvRef}
                />)
        case 'Search':
            return (
                <Search 
                    openShow={props.openShow}
                />
            )
    }
    return (<View></View>)
}

export default HomeView;
 