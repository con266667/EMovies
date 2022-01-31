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
import persistStore from 'redux-persist/es/persistStore';
import { Provider } from 'react-redux';
import persistReducer from 'redux-persist/es/persistReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Player from './Player';

const rootReducer = combineReducers({ page: PageReducer, auth: AuthReducer });

const storage = AsyncStorage;

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
Navigation.registerComponent('Player', () => Player);

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