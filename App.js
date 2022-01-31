/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import PageReducer from './PageReducer';
import { Navigation } from 'react-native-navigation';
import Header from './Header';
import Home from './Home';
import MoviePage from './MoviePage';
import HomeView from './HomeView';
import { Dimensions, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import WebView from 'react-native-webview';
import JSSoup from 'jssoup'; 
import AuthReducer from './AuthReducer';
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';
import Search from './assets/icons/search.svg';
import TV from './assets/icons/tv.svg';
import Video from './assets/icons/video.svg';
import HomeIcon from './assets/icons/home.svg';



const backgroundStyle = {
    backgroundColor: Colors.darker,
};

const App = (props) => {
    const openVideo = (url) => {
        console.log(url);
        // console.log(Navigation.)
        Navigation.push(props.componentId, {
            component: {
                name: 'Player',
                options: {
                    topBar: {
                        visible: false,
                    }
                },
                passProps: {
                    uri: url
                }
            },
        })
    }

    return (
        <View style={styles.content}>
            <View style={styles.sidebar}>
                <HomeIcon path={'#666'} style={styles.icon} />
                <TV path={'#666'} style={styles.icon} />
                <Video path={'#666'} style={styles.icon} />
                <Search path={'#666'} style={styles.icon} />
            </View>
            <Home width={Dimensions.get('window').width - 68} openVideo={openVideo}/>
        </View>
    );
};


const styles = StyleSheet.create({
    wrap: {
        paddingHorizontal: 60,
        paddingVertical: 60,
    },
    webview: {
        opacity: 0,
        width: Dimensions.get('window').width, 
        height: Dimensions.get('window').height
    },
    content: {
        flex: 1,
        flexDirection: 'row'
    },
    sidebar: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        width: 60,
    },
    sidebarItem: {
        fontFamily: 'Inter-SemiBold',
        color: '#fff',
        marginVertical: 10,
    },
    icon: {
        marginVertical: 20,
    }
});

export default App;
