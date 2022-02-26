import axios from "axios";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

function TraktOverlay(props) {
    const [hasStartedInerval, setHasStartedInerval] = React.useState(false);

    const dispatch = useDispatch();
    const addUserData = data => dispatch({ type: 'ADD_USER_DATA', payload: data });

    var tries = 0;

    const client_id = '?client_id=bd40bc484afbea19226a29277101fe86a25269479697e2e959cb3a3d25a8f819'
    const client_id_and_secret = client_id + '&client_secret=9e11df0eeab1ec88c4b33bfb8b6d3d223d432de2f7b7ffab8490a0e018ddedb8&';

    useEffect(() => {
        if (!hasStartedInerval) {
            setHasStartedInerval(true);
            const poll = setInterval(() => {
                if (tries > 120) {
                    clearInterval(poll);
                }

                const response = axios.post(
                    'https://api.trakt.tv/oauth/device/token' + client_id_and_secret +'code=' + props.deviceCode,
                );

                response.then((res) => {
                    if (res.status === 200) {
                        token = res.data['access_token'];
                        getUserInfoFromToken(token);
                        clearInterval(poll);
                        props.dismiss();
                    }
                }).catch((_) => {});
                tries++;
            }, props.interval * 1000);
        }
    });

    const getUserInfoFromToken = (token) => {
        const config = {
            headers: { 
                Authorization: `Bearer ${token}`,
                'trakt-api-key': 'bd40bc484afbea19226a29277101fe86a25269479697e2e959cb3a3d25a8f819',
                'Content-Type': 'application/json',
            }
        };
        const response = axios.get('https://api.trakt.tv/users/settings' + client_id, config);
        response.then((res) => {
            const username = res.data['user']['username'];
            const uuid = res.data['user']['ids']['uuid'];

            addUserData({
                username: username,
                uuid: uuid,
                token: token
            });
        });
    }

  return (
    <View style={styles.root}>
    <View style={styles.alert}>
    <Text style={styles.title}>Sign in to Trakt</Text>
    <Text style={styles.code}>Go to trakt.tv/activate</Text>
    <Text style={styles.code}>{props.userCode}</Text>
    
    <TouchableOpacity onPress={props.dismiss}>
        <Text style={styles.cancel}>Cancel</Text>
    </TouchableOpacity>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
    root: {
        position: 'absolute',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000050',
    },
    alert: {
        alignItems: 'center',
        backgroundColor: 'whitesmoke',
        width: 250,
        elevation: 4,
        padding: 16,
        borderRadius: 10,
    },
    title: {
        color: '#000',
        fontFamily: 'Inter-SemiBold',
        fontSize: 20,
        marginBottom: 12,
    },
    code: {
        color: '#000',
        fontFamily: 'Inter-Regular',
    },
    cancel: {
        color: '#000',
        fontFamily: 'Inter-SemiBold',
        marginTop: 12,
    }
});

TraktOverlay.options = (props) => {
  return {
    overlay: {
      interceptTouchOutside: true,
    },
  };
};

export default TraktOverlay;