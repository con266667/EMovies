/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import TraktOverlay from './TraktOverlay';
import { loadLists } from '../../utils/MainLogin';
 
 const Login = ({ navigation }) => {
    const state = useSelector(state => state);
    const dispatch = useDispatch();
    const [userCode, setUserCode] = useState('');
    const [deviceCode, setDeviceCode] = useState('');
    const [interval, setInterval] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);

    const loginDetails = async () => {
        try {
            const response = await axios.post('https://api.trakt.tv/oauth/device/code?client_id=bd40bc484afbea19226a29277101fe86a25269479697e2e959cb3a3d25a8f819');
            const json = await response.data;

            setUserCode(json['user_code']);
            setDeviceCode(json['device_code']);
            setInterval(json['interval']);
            setShowOverlay(true);
        } catch (error) {
            console.log(error)
        }
    }

    const loadUser = async (user) => {
        dispatch({ type: 'SET_CURRENT_USER', payload: user.uuid });
        await loadLists(user, dispatch);
        navigation.navigate('Main');
    }

    return (
        <View style={styles.container}>
            {state.auth.auth.users.map((user) => 
                <TouchableOpacity 
                    style={styles.option} 
                    key={user.uuid}
                    onPress={() => loadUser(user)}>
                    <Text style={styles.optionText}>{user.username}</Text>
                </TouchableOpacity>
            )}
           
            <TouchableOpacity style={styles.option}
                onPress={() => {loginDetails()}} >
                <Text style={styles.optionText}>Add User</Text>
            </TouchableOpacity>
            {showOverlay && <TraktOverlay userCode={userCode} interval={interval} deviceCode={deviceCode} dismiss={() => setShowOverlay(false)}/>}
        </View>
    )
 }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgb(18, 18, 18)',
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
 