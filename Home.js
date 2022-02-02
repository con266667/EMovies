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
  const [html, setHtml] = useState('');
  const [lists, setLists] = useState([]);

  const currentUser = () => state.auth.auth.users.filter(user => user.uuid === state.auth.auth.currentUserUUID)[0];

  const getMovie = async (movie) => {
    // const response = await axios.get(movie.vhlink);
    // console.log(response.data);
    // const thishtml = response.data;
    const link = await getAllMoviesLink(movie.title, movie.year);
    setUrl(link);
  }

  const scrapeView2 = (html) => {
    const soup = new JSSoup(html);
        
    if (soup.find('video') != null) {
        const link = soup.find('video')['attrs']['src'];
        console.log(link);
        setLoadingMovie('');
        setUrl('');
        props.openVideo(link);
    } else if (soup.find('iframe') != null) {
        if (soup.find('iframe')['attrs']['src'] != null) {
            const link = soup.find('iframe')['attrs']['src'];
            console.log(link);
            setUrl(link);
        }
    }
    return '';
  }

  const jsCode2 = "setTimeout(() => { window.ReactNativeWebView.postMessage( document.documentElement.innerHTML ); }, 1000);";

  useEffect(() => {
    const setup = async () => {
      var moviesWatched = await getMoviesWatched(currentUser(), dispatch);

      var movieRecommendations = await getMovieRecommendations(currentUser(), dispatch);

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
      <Image 
        source={{ uri: selected.image }}
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
      <Text style={styles.featureYear}>{selected.year.toString()}</Text>
      <ScrollView
        fadingEdgeLength={50}
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
                fadingEdgeLength={10}
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
                          // setSelected(item);
                          setSelected( Object.assign({}, item) );
                          if (itemLocations[list.title] !== undefined) {
                            scrollview.scrollTo({ x: 0, y: itemLocations[list.title].y, animated: true });
                          }
                        }} 
                        onPress={() => {
                          setLoadingMovie(item.title);
                          getMovie(item);
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
            // uri: 'http://192.168.86.32:9097/' + url,
            // uri: 'https://www.whatismybrowser.com/detect/what-http-headers-is-my-browser-sending',
            headers: {
              'Accept-Language': 'en-CA,en;q=0.9',
            }
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

export default Home;