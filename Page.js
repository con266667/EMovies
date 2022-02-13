import React, { useEffect, useState } from 'react';
import ReactNative, {
    Image,
    SafeAreaView,
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
  } from 'react-native';
import { Navigation } from 'react-native-navigation';

import JSSoup from 'jssoup'; 
import Header from './Header';
import { DarkenBlend, DstOverComposition, EllipticalGradient, Emboss, HardLightBlend, ImageBackgroundPlaceholder, LinearGradient, QuadGradient, RadialGradient, RectangularGradient, ScreenBlend, SoftLightBlend, SrcOverComposition } from 'react-native-image-filter-kit';
import { useDispatch, useSelector } from 'react-redux';
import { getImages } from './tmdb';
import { getAllMoviesLink, getVHLink, jsCode, scrapeView } from './scrape';
import WebView from 'react-native-webview';
import { getMovieRecommendations, getMoviesWatched } from './Trakt';
import axios from 'axios';
import { CachedImage } from '@georstat/react-native-image-cache';
import { videoImage } from './VideoInfo';
import SmallCard from './SmallCard';
  

const Page = (props) => {
  const state = useSelector(state => state)
  const dispatch = useDispatch();
  const [scrollview, setScrollview] = useState(null);
  const [itemLocations, setItemLocations] = useState({});
  const [selected, setSelected] = useState({
    title: 'Loading...',
    year: '',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/800px-A_black_image.jpg'
  });
  const [url, setUrl] = useState('');
  const [loadingMovie, setLoadingMovie] = useState({
    title: 'Loading...',
    year: '',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/800px-A_black_image.jpg'
  });

  const [cardRefs, setCardRefs] = useState({});

  const getMovie = async (movie) => {
    const link = await getAllMoviesLink(movie.title, movie.year);
    setUrl(link);
  }

  const checkForLink = (html) => {
    const link = scrapeView(html);
    if (link != '') {
      setUrl('');
      const _movie = Object.assign({}, loadingMovie);
      setLoadingMovie({});
      props.openVideo(link, _movie);
    }
  }

  return (
    <View width={props.width}>      
      <Image 
        source={{ uri: videoImage(selected.ids !== undefined ? selected.ids.imdb : '', state) }}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height * 0.55,
        }} />
      <LinearGradient 
        colors={['rgba(48, 48, 48, 1)', 'rgba(0, 0, 0, 0)', 'rgba(48, 48, 48, 1)']}
        stops={[0, 0.5, 1]}
        width={Dimensions.get('window').width}
        height={Dimensions.get('window').height * 0.55}
        style={styles.feature}
      />
      <LinearGradient
        colors={['rgba(48, 48, 48, 1)', 'rgba(0, 0, 0, 0)']}
        stops={[0, 1]}
        width={Dimensions.get('window').width}
        height={Dimensions.get('window').height * 0.55}
        style={styles.feature}
        start={{'x': '50w', 'y': '0h'}}
        end={{'x': '50w', 'y': '100h'}}
      />
      <Text style={styles.featureTitle}>{selected.title}</Text>
      <Text style={styles.featureYear}>{selected.year ?? ''}</Text>
      <ScrollView
        fadingEdgeLength={50}
        showsVerticalScrollIndicator={false}
        height={Dimensions.get('window').height * 0.5}
        ref={(ref) => setScrollview(ref)}
        >
        {
          props.lists.filter(list => list.items.length > 0).map((list) => 
            <View key={list.title}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              setItemLocations({ ...itemLocations, [list.title]: layout });
            }}>
              <Text style={styles.subtitle}>{list.title}</Text>
              <View height={5}></View>
              <ScrollView
                fadingEdgeLength={10}
                style={styles.showRow} 
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                height={150}>
                {
                  list.items.map((item, index) => 
                    <SmallCard
                      key={list.title + index.toString()}
                      index={index}
                      isTopRow = {list.title === props.lists[0].title}
                      itemLocations = {itemLocations}
                      setSelected = {setSelected}
                      item = {item}
                      scrollview = {scrollview}
                      setLoadingMovie = {setLoadingMovie}
                      loadingMovie = {loadingMovie}
                      getMovie = {getMovie}
                      openShow = {props.openShow}
                      list = {list}
                      state = {state}
                      isLast = {index === list.items.length - 1}
                      sideRef = {props.sideRef}
                    ></SmallCard>
                  )
                } 
              </ScrollView>
            </View>
          )

        }
        <View height={40}></View>
        </ScrollView>
        <WebView
          style={styles.webview}
          originWhitelist={['*']}
          javaScriptEnabledAndroid={true}
          userAgent={'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15'}
          useWebKit={true}
          incognito={true}
          javaScriptEnabled={true}
          injectedJavaScript={jsCode}
          source={{
            uri: url
          }}
          onMessage={event => checkForLink(event.nativeEvent.data)} />
    </View>
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
    featureYear: {
      position: 'absolute',
      top: 75,
      left: 0,
      fontFamily: 'Inter-Regular',
      fontSize: 20,
      color: '#fff',
    },
    subtitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 20,
      color: '#fff',
      opacity: 0.2,
    },
    showRow: {
      flexDirection: 'row',
    },
    smallCard: {
      height: 130,
      width: 200,
      borderRadius: 15,
      marginRight: 25,
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