import React from 'react';
import ReactNative, {
    Dimensions,
    StyleSheet,
    View,
  } from 'react-native';
import Video from 'react-native-video';

const Player = (props) => {
  console.log(props.uri)
  return (
    <View style={styles.main} >
        <Video
            width={Dimensions.get('window').width}
            height={Dimensions.get('window').height}
            source={{ uri: props.uri }}
            style={styles.video}
            resizeMode='cover'
            
        />
    </View>
  );
};

const styles = StyleSheet.create({
    main: {
        width: '100%',
        height: '100%',
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});

export default Player;