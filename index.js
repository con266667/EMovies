/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import { Navigation } from 'react-native-navigation';
import App from './App';
import {name as appName} from './app.json';
import Home from './Home';
import Login from './Login';
import MoviePage from './MoviePage';
import TraktOverlay from './TraktOverlay';
import getTitle from './scrape';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { combineReducers, createStore } from 'redux';
import PageReducer from './PageReducer';
import AuthReducer from './AuthReducer';
import VideoInfoReducer from './VideoInfoReducer';
import persistStore from 'redux-persist/es/persistStore';
import { Provider } from 'react-redux';
import persistReducer from 'redux-persist/es/persistReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Player from './Player';
import { CacheManager } from '@georstat/react-native-image-cache';
import { Dirs } from 'react-native-file-access';
import TVShow from './TVShow';

const rootReducer = combineReducers({ page: PageReducer, auth: AuthReducer, videoInfo: VideoInfoReducer});

const storage = AsyncStorage;

CacheManager.config = {
    baseDir: `${Dirs.CacheDir}/images_cache/`,
    blurRadius: 15,
    sourceAnimationDuration: 1000,
    thumbnailAnimationDuration: 1000,
};

// storage.clear();

const persistConfig = {
    key: 'root',
    storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

// getTitle();

// AppRegistry.registerComponent(appName, () => App);
Navigation.registerComponent('Main', () => (props) => (
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <App {...props} />
        </PersistGate>
    </Provider>
));
Navigation.registerComponent('Home', () => Home);
Navigation.registerComponent('Movie', () => MoviePage);
Navigation.registerComponent('Player', () => (props) => (
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <Player {...props} />
        </PersistGate>
    </Provider>
));

Navigation.registerComponent('TVShow', () => (props) => (
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <TVShow {...props} />
        </PersistGate>
    </Provider>
));

Navigation.registerComponent('Login', () => (props) => (
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <Login {...props} />
        </PersistGate>
    </Provider>
));


Navigation.registerComponent('TraktOverlay', () => (props) => (
    <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
            <TraktOverlay {...props} />
        </PersistGate>
    </Provider>
));

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: 'Login',
                            id: 'Login',
                            options: {
                                topBar: {
                                    visible: false,
                                }
                            }
                        }
                    }
                ]
            }
        }
    });
});