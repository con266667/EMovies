import React, { useEffect, useRef, useState } from 'react';
import ReactNative, {
    TVEventHandler,
    useTVEventHandler,
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
  } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';
import { getAllMoviesLink } from './scrape';
import { logPause, logPlay, logStop } from './Trakt';
import { isMovie } from './VideoInfo';
import Webview from './webview';


const Player = (props) => {
    const state = useSelector(state => state)
    const videoRef = useRef(null);
    const [videoInfo, setVideoInfo] = useState({"currentTime": 0, "playableDuration": 0, "seekableDuration": 1})
    const [lastEventType, setLastEventType] = React.useState('hmmm');
    const [paused, setPaused] = React.useState(false);
    const [bottomVisibility, setBottomVisibility] = React.useState(true);
    const [countdown, setCountdown] = useState(3);
    const [videoUrl, setVideoUrl] = useState(props.uri);
    const [url, setUrl] = useState('');
    const [link, setLink] = useState('');
    const [preparing, setPreparing] = useState(false);
    const [video, setVideo] = useState(props.video);
    const [episode, setEpisode] = useState(props.episode);
    const [nextEpisode, setNextEpisode] = useState(null);
    const [progress, setProgress] = useState(props.progress);

    useEffect(() => {
        const lower = setInterval(() => {

            if (countdown > 0) {
                setCountdown(countdown - 1);
            }

            if (countdown === 0 && !paused && videoInfo.seekableDuration > 1) {
                setBottomVisibility(false);
            }

            if (videoInfo.seekableDuration !== 1 && videoInfo.seekableDuration - videoInfo.currentTime < 120 && !preparing && link === '') {
                setPreparing(true);
                prepareNext(getNextEpisode(episode));
            }

            if (link !== '' && videoInfo.seekableDuration - videoInfo.currentTime < 15) {
                startNextEpisode();
            }

        }, 1000);

        return () => {
            clearInterval(lower);
        };
    }, [countdown, preparing, link]);

    const prepareNext = async (next) => {
        console.log(next);
        const _link = await getAllMoviesLink(props.video.title, props.video.year, next.number, next.season);
        setNextEpisode(next);
        setUrl(_link);
    }

    const handleLink = (link) => {
        setLink(link);
        console.log(link);
        setPreparing(false);
    }

    const startNextEpisode = () => {
        setEpisode(nextEpisode);
        setProgress(0);
        setVideoUrl(link);
        setLink('');
    }

    const getNextEpisode = (episode) => {
        if (props.seasons[episode.season].episodes.length > episode.number) {
            return props.seasons[episode.season].episodes[episode.number];
        } else if (props.seasons.length > episode.season + 1) {
            return props.seasons[episode.season + 1].episodes[0];
        } else {
            return null;
        }
    }

    const resetTimer = () => {
        setCountdown(3);
        setBottomVisibility(true);
    }

    const currentUser = () => state.auth.auth.users.filter(user => user.uuid === state.auth.auth.currentUserUUID)[0];

    const logTraktPlay = () => {
        logPlay(currentUser(), props.video, videoInfo.playableDuration / videoInfo.seekableDuration, isMovie(props.video.ids.imdb, state), episode);
    }

    const logTraktPause = () => {
        logPause(currentUser(), props.video, videoInfo.playableDuration / videoInfo.seekableDuration, isMovie(props.video.ids.imdb, state), episode);
    }

    const myTVEventHandler = evt => {    
        if (evt.eventType != 'focus' && evt.eventType != 'blur') {
            resetTimer();
        }

        if (evt.eventType === 'select') {
            if (!paused) {
                logTraktPause();
            } else {
                logTraktPlay();
            }
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

        setLastEventType(evt.eventType);
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

    return (
        <View style={styles.main} >
            <Webview handleLink={handleLink} url={url}></Webview>
            <Video
                onLoad={(video) => {
                    setCountdown(2);
                    setPreparing(false);
                    logTraktPlay();
                    if (progress !== undefined && progress !== 0) {
                        videoRef.current.seek(parseInt((progress / 100) * video.duration));
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
                    minBufferMs: 300000,
                    maxBufferMs: 50000000,
                    bufferForPlaybackAfterRebufferMs: 1000
                }}
                style={styles.video}
                resizeMode='contain'
                onProgress={(e) => setVideoInfo(e)}
            />
            {bottomVisibility &&
            <>
            <View style={styles.progressBarOuter} />
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