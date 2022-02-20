import React, { useEffect, useState } from 'react';
import ReactNative, {
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
  } from 'react-native';

import { LinearGradient } from 'react-native-image-filter-kit';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMoviesLink, getVHLink, jsCode, scrapeView } from '../../../utils/Scrape';
import SmallCard from './SmallCard';
import Webview from '../../../utils/Webview';
  

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

  const getMovie = async (movie) => {
    const link = await getAllMoviesLink(movie.title, movie.year);
    setUrl(link);
  }

  const openShow = async (show) => {
    props.navigation.navigate('TVShow', {
      show: show
    })
  }

  const handleLink = (link) => {
    setUrl('');
    const _video = Object.assign({}, loadingMovie);
    setLoadingMovie({});
    props.navigation.navigate('Player', {
      video: _video,
      url: link,
    });
  }

  return (
    props.lists.length > 0 ?
    <View width={props.width}>      
      { selected.title !== 'Loading...' ?
      <Image 
        source={{ uri: selected.backdrop.replace('original', 'w1280') }}
        style={{
          width: Dimensions.get('window').width - 200,
          height: Dimensions.get('window').height * 0.48,
          marginLeft: 200
        }} /> : 
        <View style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height * 0.48,
        }}></View>
      }
      <ScrollView
        fadingEdgeLength={50}
        showsVerticalScrollIndicator={false}
        height={Dimensions.get('window').height * 0.6}
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
                height={180}>
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
                      openShow = {openShow}
                      list = {list}
                      state = {state}
                      isLast = {index === list.items.length - 1}
                      sideRef = {props.sideRef} />
                  )
                } 
              </ScrollView>
            </View>
          )

        }
        <View height={40}></View>
        </ScrollView>
        <LinearGradient 
          colors={['rgba(18, 18, 18, 1)', 'rgba(0, 0, 0, 0)', 'rgba(18, 18, 18, 1)']}
          stops={[0, 0.5, 1]}
          style={{
            position: 'absolute',
            width: Dimensions.get('window').width - 200,
            height: Dimensions.get('window').height * 0.48,
            top: 0,
            right: 0,
          }}
          start={{'x': '0w', 'y': '50h'}}
          end={{'x': '100w', 'y': '50h'}}
          // style={styles.feature}
        />
        <LinearGradient
          colors={['rgba(18, 18, 18, 1)', 'rgba(0, 0, 0, 0)']}
          stops={[0, 1]}
          style={{
            position: 'absolute',
            width: Dimensions.get('window').width - 200,
            height: Dimensions.get('window').height * 0.48,
            top: 0,
            right: 0,
          }}
          start={{'x': '50w', 'y': '0h'}}
          end={{'x': '50w', 'y': '100h'}}
        />
        <Text style={styles.featureTitle}>{selected.title}</Text>
        <Text style={styles.featureDescription}>{selected.description ?? ''}</Text>
        <Text style={styles.featureYear}>{selected.year ?? ''}</Text>
        <Webview url={url} handleLink={handleLink}></Webview>
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
      marginRight: 100,
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