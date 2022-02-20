/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Dimensions, View } from 'react-native';
import Search from './tabs/Search';
import { useSelector } from 'react-redux';
import Page from './components/Page';

const HomeView = (props) => {
    const state = useSelector(state => state)

    console.log(state.auth.auth.lists[state.auth.auth.currentUserUUID]['home']['lists']);

    switch(props.page) {
        case 'Home':
            return (
                <Page 
                    lists={state.auth.auth.lists[state.auth.auth.currentUserUUID]['home']['lists']}  
                    navigation={props.navigation}
                    width={Dimensions.get('window').width - 68} 
                    sideRef={props.homeRef} />
                );
        case 'Movie':
            return (<View />)
        case 'TV':
            return (
                <Page 
                    lists={state.auth.auth.lists[state.auth.auth.currentUserUUID]['tv']['lists']}  
                    navigation={props.navigation}
                    width={Dimensions.get('window').width - 68} 
                    sideRef={props.tvRef} />
                )
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
 