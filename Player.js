import React, { useState } from 'react';
import ReactNative, {
    TVEventHandler,
    useTVEventHandler,
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
  } from 'react-native';
import Video from 'react-native-video';


const Player = (props) => {
  const videoRef = React.useRef(null);
  const [videoInfo, setVideoInfo] = useState({"currentTime": 0, "playableDuration": 0, "seekableDuration": 1})
  const [lastEventType, setLastEventType] = React.useState('hmmm');
  const [paused, setPaused] = React.useState(false);

  const myTVEventHandler = evt => {
    if (evt.eventType === 'select') {
        setPaused(!paused);
    } else if (evt.eventType === 'right') {
        if (videoRef !== null) {
            videoRef.current.seek(videoInfo.currentTime + 10);
        }
    } else if (evt.type === 'left') {
        if (videoRef !== null) {
            videoRef.current.seek(videoInfo.currentTime - 10);
        }
    }
    setLastEventType(evt.eventType);
  };

  useTVEventHandler(myTVEventHandler);

  const timeLeftString = (d) => {
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + ":" : "";
    var mDisplay = m > 0 ? (m < 10 ? "0" + m : m) : "";
    var sDisplay = s < 10 ? "0" + s : s;
    return hDisplay + mDisplay + ":" + sDisplay; 
  }

  return (
    <View style={styles.main} >
        <Video
            ref={videoRef}
            paused={paused}
            width={Dimensions.get('window').width}
            height={Dimensions.get('window').height}
            source={{ uri: props.uri }}
            bufferConfig={{
                minBufferMs: 30000,
                maxBufferMs: 500000,
                bufferForPlaybackAfterRebufferMs: 10000
            }}
            style={styles.video}
            resizeMode='contain'
            onProgress={(e) => setVideoInfo(e)}
        />
        <View style={styles.progressBarOuter}></View>
        <TouchableWithoutFeedback hasTVPreferredFocus={true}>
        <View 
            style={styles.progressBarBuffer} 
            width={Dimensions.get('window').width * ((videoInfo.playableDuration / videoInfo.seekableDuration) * 0.89)}
        ></View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
        <View 
            style={styles.progressBarInner} 
            width={Dimensions.get('window').width * ((videoInfo.currentTime / videoInfo.seekableDuration) * 0.89)}
        ></View>
        </TouchableWithoutFeedback>
        <Text style={styles.timeLeft}>{timeLeftString(videoInfo.seekableDuration - videoInfo.currentTime)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    main: {
        backgroundColor: '#000',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    progressBarOuter: {
        position: 'absolute',
        width: '88%',
        left: '2.5%',
        height: 8,
        bottom: 10,
        borderRadius: 4,
        backgroundColor: '#444',
    },
    progressBarInner: {
        position: 'absolute',
        left: '2.5%',
        height: 8,
        bottom: 10,
        borderBottomStartRadius: 4,
        borderTopStartRadius: 4,
        backgroundColor: '#f12',
    },
    progressBarBuffer: {
        position: 'absolute',
        left: '2.5%',
        height: 8,
        bottom: 10,
        borderBottomStartRadius: 4,
        borderTopStartRadius: 4,
        backgroundColor: '#888',
    },
    timeLeft: {
        position: 'absolute',
        fontSize: 15,
        bottom: 4,
        right: '2.5%',
        color: '#fff',
        fontFamily: 'Inter-Regular',
    }
});

export default Player;