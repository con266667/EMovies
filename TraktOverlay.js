import axios from "axios";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Navigation } from "react-native-navigation";
import { addToken } from "./AuthActions";

function TraktOverlay({ componentId, userCode, interval, deviceCode }) {
  const dismiss = () => {
      Navigation.dismissOverlay(componentId);
  };

  var tries = 0;

    useEffect(() => {
        const poll = setInterval(() => {
            if (tries > 120) {
                poll.clearInterval();
            }
            const response = axios.post(
                'https://api.trakt.tv/oauth/device/token?client_id=bd40bc484afbea19226a29277101fe86a25269479697e2e959cb3a3d25a8f819&client_secret=9e11df0eeab1ec88c4b33bfb8b6d3d223d432de2f7b7ffab8490a0e018ddedb8&code=' + deviceCode,
            );
            response.then((res) => {
                if (res.status === 200) {
                    token = res.data['access_token'];
                    console.log(token);
                    addToken(token);
                    clearInterval(poll);
                    dismiss();
                }
            }).catch((err) => {
                // console.log(err)
                console.log("Not ready yet");
            });
            tries++;
        }, interval * 1000);
    });

  return (
    <View style={styles.root}>
    <View style={styles.alert}>
    <Text style={styles.title}>Sign in to Trakt</Text>
    <Text style={styles.code}>Go to trakt.tv/activate</Text>
    <Text style={styles.code}>{userCode}</Text>
    
    <TouchableOpacity onPress={dismiss}>
        <Text style={styles.cancel}>Cancel</Text>
    </TouchableOpacity>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
    root: {
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