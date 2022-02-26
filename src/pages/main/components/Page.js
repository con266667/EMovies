import React, { useEffect, useRef, useState } from 'react';
import ReactNative, {
    useTVEventHandler,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    ScrollView,
    View,
    Pressable,
    Dimensions,
    ActivityIndicator,
    findNodeHandle,
    InteractionManager,
  } from 'react-native';

import { LinearGradient } from 'react-native-image-filter-kit';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMoviesLink, getVHLink, jsCode, scrapeView } from '../../../utils/Scrape';
import YoutubePlayer from 'react-native-youtube-iframe';
import SmallCard from './SmallCard';
import Webview from '../../../utils/Webview';
import { trailerId } from '../../../utils/Trailer';
import Video from 'react-native-video';
import axios from 'axios';
  

const Page = (props) => {
  const state = useSelector(state => state)
  const [selected, setSelected] = useState({
    title: 'Loading...',
    year: '',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/800px-A_black_image.jpg'
  });
  const [trailerUrl, setTrailerUrl] = useState('');
  const [loadingMovie, setLoadingMovie] = useState({
    title: 'Loading...',
    year: '',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/800px-A_black_image.jpg'
  });
  // const [playTimeout, setPlayTimeout] = useState(null);
  var playTimeout = useRef();
  var trailerTimeout = useRef();
  const [playTrailer, setPlayTrailer] = useState(false);
  const selectedTitleRef = useRef();

  selectedTitleRef.current = selected.title;

  useEffect(() => {
    if (
      selected.title === 'Loading...' &&
      props.lists !== undefined &&
      props.lists.length !== 0 &&
      props.lists[0].items !== undefined &&
      props.lists[0].items.length !== 0 &&
      props.lists[0].items[0] !== undefined
    ) {
      setSelected(props.lists[0].items[0]);
    }
  }, [selected]);

  const myTVEventHandler = evt => {    
    if (evt.eventType === 'right' || evt.eventType === 'left' || evt.eventType === 'up' || evt.eventType === 'down' || evt.eventType === 'select') {
      clearYoutubeKey();
    }
  };

  useTVEventHandler(myTVEventHandler);

  const clearYoutubeKey = () => {
    // if (playTimeout.current) {
    //   clearTimeout(playTimeout.current);
    // }

    if (trailerTimeout.current) {
      clearTimeout(trailerTimeout.current);
    }

    setTimeout(() => {
      setTrailerUrl('');
    }, 50);
  }

  const selectVideo = async (video) => {
    setSelected(video);
    trailerTimeout.current = setTimeout(async () => {
      if (selectedTitleRef.current === video.title) {
        const _trailerUrl = await trailerId(video);
        setTrailerUrl(_trailerUrl);
      }
    }, 1000);
  }

  return (
    props.lists.length > 0 ?
    <View width={props.width} opacity={props.opacity}>      
      { selected.title !== 'Loading...' ?
      <Image 
        source={{ uri: selected.backdrop.replace('original', 'w1280') }}
        style={{
          width: Dimensions.get('window').width - 400,
          height: Dimensions.get('window').height * 0.48,
          marginLeft: 400
        }} /> : 
        <View style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height * 0.48,
        }}></View>
      }
      <ScrollView
        fadingEdgeLength={50}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        height={Dimensions.get('window').height * 0.6}
        ref={(ref) => props.setScrollviewRef(ref)}
        >
        {
          props.lists.filter(list => list.items.length > 0).map((list, i) => 
            <View key={i}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              props.setItemLocations({ ...props.itemLocations, [list.page + list.title]: layout });
            }}>
              <Text style={styles.subtitle}>{list.title}</Text>
              <View height={5}></View>
              <ScrollView
                fadingEdgeLength={10}
                style={styles.showRow} 
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                height={180}>
                {
                  list.items.map((item, index) => 
                    <SmallCard
                      key={index}
                      index={index}
                      listFirstRefs = {props.listFirstRefs}
                      setListFirstRefs = {props.setListFirstRefs}
                      isTopRow = {list.title === props.lists[0].title && list.page === 'home'}
                      itemLocations = {props.itemLocations}
                      scrollToList = {props.scrollToList}
                      setSelected = {selectVideo}
                      item = {item}
                      scrollview = {props.scrollviewRef}
                      setLoadingMovie = {setLoadingMovie}
                      loadingMovie = {loadingMovie}
                      navigation = {props.navigation}
                      list = {list}
                      state = {state}
                      isLast = {index === list.items.length - 1}
                      clearYoutubeKey = {clearYoutubeKey}
                      sideRefs = {props.sideRefs} />
                  )
                } 
              </ScrollView>
            </View>
          )

        }
        <View height={40}></View>
        </ScrollView>
        { trailerUrl !== '' ?
        <Video
          resizeMode='cover'
          onEnd={() => {
            setTrailerUrl('');
          }}
          source={{ uri: trailerUrl }}
          style={{
            backgroundColor: 'black',
            position: 'absolute',
            height: Dimensions.get('window').height * 0.47,
            width: Dimensions.get('window').width - 450,
            top: 0,
            right: 0,
          }}/> : <View />
        }
        <LinearGradient 
          colors={['rgba(18, 18, 18, 1)', 'rgba(0, 0, 0, 0)']}
          style={{
            position: 'absolute',
            width: Dimensions.get('window').width - 300,
            height: Dimensions.get('window').height * 0.48,
            top: 0,
            marginLeft: 330,
          }}
          start={{'x': '10w', 'y': '50h'}}
          end={{'x': '30w', 'y': '50h'}}
          // style={styles.feature}
        />

        <LinearGradient
          colors={['rgba(18, 18, 18, 1)', 'rgba(0, 0, 0, 0)']}
          stops={[0, 1]}
          style={{
            position: 'absolute',
            width: Dimensions.get('window').width - 400,
            height: Dimensions.get('window').height * 0.48,
            top: 0,
            right: 0,
          }}
          start={{'x': '50w', 'y': '0h'}}
          end={{'x': '50w', 'y': '100h'}}
        />
        <Text style={styles.featureTitle}>{selected.title}</Text>
        <Text style={styles.featureDescription}>{(selected.description ?? '').substring(0, 250).split('.')[0] + '.' ?? ''}</Text>
        <Text style={styles.featureYear}>{selected.year ?? ''}</Text>
    </View> : <ActivityIndicator />
  );
};

const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontFamily: 'Inter',
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      fontFamily: 'Inter',
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
    feature: {
      height: '55%',
      width: '100%',
      // backgroundColor: '#fff',
      position: 'absolute',
      top: 0,
    },
    featureTitle: {
      position: 'absolute',
      top: 25,
      left: 0,
      fontFamily: 'Inter-Bold',
      fontSize: 40,
      color: '#fff',
    },
    featureDescription: {
      position: 'absolute',
      marginRight: 500,
      top: 110,
      left: 0,
      fontFamily: 'Inter-Light',
      fontSize: 18,
      color: '#fff',
    },
    featureYear: {
      position: 'absolute',
      top: 78,
      left: 0,
      fontFamily: 'Inter-Regular',
      fontSize: 20,
      color: '#fff',
    },
    subtitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 20,
      color: '#888',
    },
    showRow: {
      flexDirection: 'row',
    },
    webview: {
      opacity: 0,
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
    },
    loadingSmallCard: {
      marginTop: -104,
      marginRight: 33,
    }
  });

export default Page;