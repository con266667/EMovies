/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useEffect } from 'react';
 import { Provider, useSelector } from 'react-redux';
 import { createStore } from 'redux';
 import PageReducer from './PageReducer';
 import { Navigation } from 'react-native-navigation';
 import Header from './Header';
 import Home from './Home';
 import MoviePage from './MoviePage';
 import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
 import userLoginDetails from './Trakt';
import axios from 'axios';
 
 const Login = () => {

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
            <TouchableOpacity style={styles.option}>
                <Text style={styles.optionText}>Connor</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}
                onPress={() => {loginDetails()}}
            >
                <Text style={styles.optionText}>Add User</Text>
            </TouchableOpacity>
        </View>
    )
 }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
       flexDirection: 'row',
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
 