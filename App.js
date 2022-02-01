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
import { Dimensions, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
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
    const [selectedPage, setSelectedPage] = useState('Home');
    const [sidebarActive, setSidebarActive] = useState(false);

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

    const setPage = (page) => {
        setSelectedPage(page);
        setSidebarActive(true);
    }

    const homeRef = React.useRef(null);

    return (
        <View style={styles.content}>
            <View style={styles.sidebar}>
                <TouchableWithoutFeedback 
                    onFocus={() => setPage('Home')} 
                    onBlur={() => setSidebarActive(false)}
                    ref={(ref) => homeRef.current = ref} >
                    <HomeIcon 
                        path={selectedPage === 'Home' ? '#fff' : '#666'} 
                        style={styles.icon} 
                        opacity={selectedPage === 'Home' && sidebarActive ? 0.7 : 1} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onFocus={() => setPage('TV')} onBlur={() => setSidebarActive(false)}>
                    <TV 
                        path={selectedPage === 'TV' ? '#fff' : '#666'} 
                        style={styles.icon} 
                        opacity={selectedPage === 'TV' && sidebarActive ? 0.7 : 1} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onFocus={() => setPage('Movies')} onBlur={() => setSidebarActive(false)}>
                    <Video 
                        path={selectedPage === 'Movies' ? '#fff' : '#666'} 
                        style={styles.icon} 
                        opacity={selectedPage === 'Movies' && sidebarActive ? 0.7 : 1} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onFocus={() => setPage('Search')} onBlur={() => setSidebarActive(false)}>
                    <Search 
                        path={selectedPage === 'Search' ? '#fff' : '#666'} 
                        style={styles.icon} 
                        opacity={selectedPage === 'Search' && sidebarActive ? 0.7 : 1} />
                </TouchableWithoutFeedback>
            </View>
            {/* <Home width={Dimensions.get('window').width - 68} openVideo={openVideo} sideRef={homeRef}/> */}
            <HomeView page={selectedPage} openVideo={openVideo} sideRef={homeRef} />
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
        flexDirection: 'row',
        backgroundColor: 'rgb(48,48,48)',
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
