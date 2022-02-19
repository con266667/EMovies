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
import AuthReducer from './AuthReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoInfoReducer from './VideoInfoReducer';
import { persistStore, persistReducer } from 'redux-persist';
import { NavigationContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import Main from './Main';
import Player from './Player';
 
const rootReducer = combineReducers({ page: PageReducer, auth: AuthReducer, videoInfo: VideoInfoReducer});

const storage = AsyncStorage;

const persistConfig = {
    key: 'root',
    storage: storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

const Stack = createNativeStackNavigator();


const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}> 
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Player" component={Player} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
