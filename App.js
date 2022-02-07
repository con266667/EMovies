/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
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
import { BlurView } from "@react-native-community/blur";



const backgroundStyle = {
    backgroundColor: Colors.darker,
};

const App = (props) => {
    const state = useSelector(state => state);
    const dipatch = useDispatch();
    const [sidebarActive, setSidebarActive] = useState(false);

    const openVideo = (url, video, episode, progress, seasons) => {
        Navigation.push(props.componentId, {
            component: {
                name: 'Player',
                options: {
                    topBar: {
                        visible: false,
                    }
                },
                passProps: {
                    uri: url,
                    video: video,
                    episode: episode,
                    progress: progress,
                    seasons: seasons,
                }
            },
        })
    }

    const openShow = (show) => {
        Navigation.push(props.componentId, {
            component: {
                name: 'TVShow',
                options: {
                    topBar: {
                        visible: false,
                    }
                },
                passProps: {
                    show: show,
                    'openVideo': openVideo
                }
            },
        })
    }

    const setPage = (page) => {
        // setSelectedPage(page);
        dipatch({ type: 'CHANGE_PAGE', payload: page });
        setSidebarActive(true);
    }

    const homeRef = React.useRef(null);
    const tvRef = React.useRef(null);

    return (
        <View style={styles.content}>
            <View style={styles.sidebar}>
                <TouchableWithoutFeedback
                    // hasTVPreferredFocus={state.page.page.page === 'Home'}
                    onFocus={() => setPage('Home')} 
                    onBlur={() => setSidebarActive(false)}
                    ref={(ref) => homeRef.current = ref} >
                    <HomeIcon 
                        path={state.page.page.page === 'Home' ? '#fff' : '#666'} 
                        style={styles.icon} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback 
                    // hasTVPreferredFocus={state.page.page.page === 'TV'}
                    onFocus={() => setPage('TV')} 
                    onBlur={() => setSidebarActive(false)}
                    ref={(ref) => tvRef.current = ref} >
                    <TV 
                        path={state.page.page.page === 'TV' ? '#fff' : '#666'} 
                        style={styles.icon} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback 
                    onFocus={() => setPage('Movies')} 
                    onBlur={() => setSidebarActive(false)}
                    // hasTVPreferredFocus={state.page.page.page === 'Movies'}
                    >
                    <Video 
                        path={state.page.page.page === 'Movies' ? '#fff' : '#666'} 
                        style={styles.icon} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback 
                    onFocus={() => setPage('Search')} 
                    onBlur={() => setSidebarActive(false)}
                    // hasTVPreferredFocus={state.page.page.page === 'Search'}
                    >
                    <Search 
                        path={state.page.page.page === 'Search' ? '#fff' : '#666'} 
                        style={styles.icon} />
                </TouchableWithoutFeedback>
            </View>
            <HomeView page={state.page.page.page} openVideo={openVideo} homeRef={homeRef} tvRef={tvRef} openShow={openShow} />
            { sidebarActive &&
                <BlurView
                    style={styles.absolute}
                    overlayColor=''
                    blurType="dark"
                    blurAmount={3}
                />
            }
        </View>
    );
};


const styles = StyleSheet.create({
    absolute: {
        position: "absolute",
        top: 0,
        left: 60,
        bottom: 0,
        right: 0
    },
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
