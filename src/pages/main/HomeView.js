/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import Home from './tabs/Home';
import { Dimensions, View } from 'react-native';
import Shows from './tabs/Shows';
import Search from './tabs/Search';

const HomeView = (props) => {
    switch(props.page) {
        case 'Home':
            return (
                <Home
                    navigation={props.navigation}
                    width={Dimensions.get('window').width - 68} 
                    sideRef={props.homeRef} 
                />)
        case 'Movie':
            return (<View />)
        case 'TV':
            return (
                <Shows
                    navigation={props.navigation}
                    width={Dimensions.get('window').width - 68} 
                    sideRef={props.tvRef}
                />)
        case 'Search':
            return (
                <Search 
                    navigation={props.navigation}
                    openShow={props.openShow}
                />
            )
    }
    return (<View></View>)
}

export default HomeView;
 