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

import Header from './Header';
import { DarkenBlend, DstOverComposition, EllipticalGradient, Emboss, HardLightBlend, ImageBackgroundPlaceholder, RadialGradient, ScreenBlend, SoftLightBlend, SrcOverComposition } from 'react-native-image-filter-kit';
import { useDispatch, useSelector } from 'react-redux';
import { getImages } from './tmdb';
import { getVHLink, jsCode, scrapeView } from './scrape';
import WebView from 'react-native-webview';
import { getMovieRecommendations, getMoviesWatched } from './Trakt';
// import { ImageCacheProvider, CachedImage } from 'react-native-cached-image';
  

const Home = (props) => {
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
  const [loadingMovie, setLoadingMovie] = useState('');

  const [lists, setLists] = useState([]);

  const currentUser = () => state.auth.auth.users.filter(user => user.uuid === state.auth.auth.currentUserUUID)[0];

  useEffect(() => {
    const setup = async () => {
      moviesWatched = await getMoviesWatched(currentUser(), dispatch);

      movieRecommendations = await getMovieRecommendations(currentUser(), dispatch);

      setLists(_ => [
        {
          'title': 'Continue Watching',
          'items': currentUser().moviesWatched
        },
        {
          'title': 'Recommended',
          'items': movieRecommendations
        }
      ]);
    }

    if (lists.length === 0) {
     setup();
    }
  }, [setLists]);

  const checkForLink = (html) => {
    const link = scrapeView(html);
    if (link != '') {
      setLoadingMovie('');
      setUrl('');
      props.openVideo(link);
    }
  }

  return (
    <View width={props.width}>
      <DstOverComposition
        style={{ 
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height * 0.55,
        }}
        dstTransform={{
          scale: 'CONTAIN'
        }}
        srcImage={
            <Image
              source={{
                uri: selected.image
              }}
            />
        }
        srcTransform={{
          anchor: { x: 0.5, y: 0.7 },
          translate: { x: 0.5, y: 1 }
        }}
        dstImage={
          <EllipticalGradient
            colors={['rgba(0, 0, 0, 0)', 'rgba(48, 48, 48, 1)']}
            radiusX={'160min'}
            center={{ x: '50w', y: '50h' }}
          />
        }
        dstTransform={{
          scale: 'COVER'
        }}
      />
      <Text style={styles.featureTitle}>{selected.title}</Text>
      <Text style={styles.featureYear}>{selected.year.toString()}</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        height={Dimensions.get('window').height * 0.5}
        ref={(ref) => setScrollview(ref)}
        >
        {
          lists.map((list) => 
            <View key={list.title}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              setItemLocations({ ...itemLocations, [list.title]: layout });
            }}>
              <Text style={styles.subtitle}>{list.title}</Text>
              <View height={5}></View>
              <ScrollView
                style={styles.showRow} 
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                height={150}>
                {
                  list.items.map((item) => 
                    <View key={item.title}>
                      <TouchableOpacity
                        hasTVPreferredFocus={list.items[0] === item && list.title === 'Continue Watching'}
                        nextFocusLeft = {findNodeHandle(props.sideRef.current)}
                        activeOpacity={.5}
                        onFocus={() => {
                          setSelected(item);
                          // setSelected( Object.assign({}, item) );
                          if (itemLocations[list.title] !== undefined) {
                            scrollview.scrollTo({ x: 0, y: itemLocations[list.title].y, animated: true });
                          }
                        }} 
                        onPress={() => {
                          setLoadingMovie(item.title)
                          setUrl(item.vhlink);
                        }}>
                        <Image
                        style={styles.smallCard}
                        source={{
                          uri: item.image,
                        }} />
                      </TouchableOpacity>
                      <ActivityIndicator 
                        style={styles.loadingSmallCard} 
                        size={80} color={'#fff'} 
                        opacity={loadingMovie === item.title ? 1 : 0} />
                    </View>
                  )
                } 
              </ScrollView>
            </View>
          )

        }
        
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
            uri: url,
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
    },
    loadingSmallCard: {
      marginTop: -104,
      marginRight: 33,
    }
  });

export default Home;