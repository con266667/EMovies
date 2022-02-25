import React, { useEffect, useRef, useState } from 'react';
import ReactNative, {
    TVEventHandler,
    useTVEventHandler,
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    ActivityIndicator,
    BackHandler,
  } from 'react-native';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';
import { getAllMoviesLink } from '../utils/Scrape';
import { logPause, logPlay } from '../utils/Trakt';
import Webview from '../utils/Webview';


const Player = (props) => {
    const state = useSelector(state => state);
    const routeParams = props.route.params;
    const videoRef = useRef(null);
    const [videoInfo, setVideoInfo] = useState({"currentTime": 0, "playableDuration": 0, "seekableDuration": 1})
    const [paused, setPaused] = React.useState(false);
    const [bottomVisibility, setBottomVisibility] = React.useState(true);
    const [countdown, setCountdown] = useState(3);
    const [videoUrl, setVideoUrl] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            logTraktPause();
            props.navigation.goBack();
            return true;
        });

        if (videoUrl === '') {
            getVideoAndStart();
        }

        const lower = setInterval(() => {

            if (countdown > 0) {
                setCountdown(countdown - 1);
            }

            if (countdown === 0 && !paused && videoInfo.seekableDuration > 1) {
                setBottomVisibility(false);
            }
        }, 1000);

        return () => {
            backHandler.remove();
            clearInterval(lower);
        };
    }, [countdown]);

    const getVideoAndStart = async () => {
        const _link = await getAllMoviesLink(routeParams.video.title, routeParams.video.year, routeParams.video.episode, routeParams.video.season);
        setUrl(_link);
    }

    const handleLink = (link) => {
        setVideoUrl(link);
        setUrl('');
    }

    const resetTimer = () => {
        setCountdown(3);
        setBottomVisibility(true);
    }

    const myTVEventHandler = evt => {    
        if (evt.eventType != 'focus' && evt.eventType != 'blur') {
            resetTimer();
        }

        if (evt.eventType === 'select') {
            setPaused(!paused);
        } else if (evt.eventType === 'right') {
            if (videoRef !== null) {
                videoRef.current.seek(videoInfo.currentTime + 10);
            }
        } else if (evt.eventType === 'left') {
            if (videoRef !== null) {
                videoRef.current.seek(videoInfo.currentTime - 10);
            }
        }
    };

    useTVEventHandler(myTVEventHandler);

    const timeLeftString = (d) => {
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = h > 0 ? h + ":" : "";
        var mDisplay = m >= 0 ? (m < 10 ? "0" + m : m) : "";
        var sDisplay = s < 10 ? "0" + s : s;
        return hDisplay + mDisplay + ":" + sDisplay; 
    }

    const currentUser = () => state.auth.auth.users.filter(user => user.uuid === state.auth.auth.currentUserUUID)[0];

    const logTraktPlay = () => {
        logPlay(currentUser(), routeParams.video, videoInfo.playableDuration / videoInfo.seekableDuration);
    }

    const logTraktPause = () => {
        logPause(currentUser(), routeParams.video, videoInfo.playableDuration / videoInfo.seekableDuration);
    }

    const progress = () => routeParams.video.progress(state);

    const progressUpdate = (info) => {
        setVideoInfo(info);
    }

    // console.log(state.auth.auth.watchProgress[state.auth.auth.currentUserUUID].find(v => (v['movie'] ?? v['show']).ids.imdb === routeParams.video.ids.imdb));

    return (
        <View style={styles.main} >
            <Webview handleLink={handleLink} url={url}></Webview>

            { videoUrl !== '' ?
            <Video
                onLoad={(video) => {
                    logTraktPlay();
                    setCountdown(2);
                    if (progress() !== 0 && progress() <= 98) {
                        const p = parseInt((progress() / 100) * video.duration);
                        videoRef.current.seek(p > 15 ? p - 15 : 0);
                    }
                }}
                // maxBitRate={100000}
                ref={videoRef}
                paused={paused}
                width={Dimensions.get('window').width}
                height={Dimensions.get('window').height}
                source={{
                    uri: videoUrl,
                }}
                bufferConfig={{
                    minBufferMs: 500000,
                    maxBufferMs: 0,
                    bufferForPlaybackAfterRebufferMs: 1000
                }}
                style={styles.video}
                resizeMode='contain'
                onProgress={progressUpdate}
            /> : 
            <ActivityIndicator size={65} />
            }

            {/* <View style={styles.nextCountdownBack} width={100} backgroundColor={'#999'}></View> */}
            {bottomVisibility &&
            <>
            <View style={styles.progressBarOuter} />
            <TouchableWithoutFeedback hasTVPreferredFocus={true}>
            <View 
                style={styles.progressBarBuffer} 
                width={Dimensions.get('window').width * ((videoInfo.playableDuration / videoInfo.seekableDuration) * 0.89)}
            />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback>
            <View 
                style={styles.progressBarInner} 
                width={Dimensions.get('window').width * ((videoInfo.currentTime / videoInfo.seekableDuration) * 0.89)}
            />
            </TouchableWithoutFeedback>
            <Text style={styles.timeLeft}>{timeLeftString(videoInfo.seekableDuration - videoInfo.currentTime)}</Text>
            </>
            }
            <TouchableWithoutFeedback><View width={10} height={10} position={'absolute'}></View></TouchableWithoutFeedback>
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
        nextCountdownBack: {
            flexDirection: 'row',
            backgroundColor: '#fff',
            position: 'absolute',
            borderRadius: 10,
            bottom: 50,
            right: 50,
            width: 150,
            height: 40,
        },
        nextCountdownFront: {
            backgroundColor: '#999',
            borderTopLeftRadius: 10,
            borderBottomStartRadius: 10,
        },
        nextCountdownText: {
            position: 'absolute',
            bottom: 50,
            right: 50,
            fontSize: 20,
            width: 150,
            height: 40,
            color: '#000',
            backgroundColor: 'transparent',
            textAlign: 'center',
            fontFamily: 'Inter-Bold',
            paddingTop: 5,
        },  
        progressBarOuter: {
            position: 'absolute',
            width: '88%',
            left: '2.5%',
            height: 8,
            bottom: 15,
            borderRadius: 4,
            backgroundColor: '#444',
        },
        progressBarInner: {
            position: 'absolute',
            left: '2.5%',
            height: 8,
            bottom: 15,
            borderBottomStartRadius: 4,
            borderTopStartRadius: 4,
            backgroundColor: '#f12',
        },
        progressBarBuffer: {
            position: 'absolute',
            left: '2.5%',
            height: 8,
            bottom: 15,
            borderBottomStartRadius: 4,
            borderTopStartRadius: 4,
            backgroundColor: '#888',
        },
        timeLeft: {
            position: 'absolute',
            fontSize: 15,
            bottom: 9,
            right: '2.5%',
            color: '#fff',
            fontFamily: 'Inter-Regular',
        },
    });

export default Player;