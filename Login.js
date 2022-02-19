/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useEffect, useState } from 'react';
 import { Provider, useDispatch, useSelector } from 'react-redux';
 import { createStore } from 'redux';
 import PageReducer from './PageReducer';
 import { Navigation, NavigationComponent } from 'react-native-navigation';
 import Header from './Header';
 import Home from './Home';
 import MoviePage from './MoviePage';
 import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
 import userLoginDetails, { getMoviesWatched, getPlayback } from './Trakt';
import axios from 'axios';
import TraktOverlay from './TraktOverlay';
 
 const Login = () => {
    const state = useSelector(state => state);
    const dispatch = useDispatch();

    const loginDetails = async () => {
        try {
            const response = await axios.post('https://api.trakt.tv/oauth/device/code?client_id=bd40bc484afbea19226a29277101fe86a25269479697e2e959cb3a3d25a8f819');
            const json = await response.data;

            Navigation.showOverlay({
                component: {
                    name: 'TraktOverlay',
                    id: 'Main',
                    passProps: {
                        userCode: json['user_code'],
                        interval: json['interval'],
                        deviceCode: json['device_code'],
                    }
                }
            });
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={styles.container}>
            {state.auth.auth.users.map((user) => 
                <TouchableOpacity
                    style={styles.option} 
                    key={user.uuid}
                    onPress={() => {
                        dispatch({ type: 'SET_CURRENT_USER', payload: user.uuid });
                        // getPlayback(user, dispatch, state);
                        Navigation.push('Login', {
                            component: {
                            name: 'Main',
                            options: {
                                topBar: {
                                    visible: false,
                                }
                            }
                            },
                        })}
                      }>
                    <Text style={styles.optionText}>{user.username}</Text>
                </TouchableOpacity>
            )}
           
            <TouchableOpacity 
                hasTVPreferredFocus={true}
                style={styles.option}
                onPress={() => {loginDetails()}} >
                <Text style={styles.optionText}>Add User</Text>
            </TouchableOpacity>

            <TraktOverlay deviceCode={deviceCode} userCode={userCode} interval={interval} ></TraktOverlay>
        </View>
    )
 }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgb(48, 48, 48)',
    },
    option: {
        backgroundColor: '#fff',
        height: 100,
        width: 100,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
    optionText: {
        fontSize: 15,
        fontFamily: 'Inter-SemiBold',
        color: '#000'
    }
});
 
 export default Login;
 