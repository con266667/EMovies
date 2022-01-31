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
  } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Navigation } from 'react-native-navigation';

import Header from './Header';
import { DarkenBlend, DstOverComposition, EllipticalGradient, Emboss, HardLightBlend, ImageBackgroundPlaceholder, RadialGradient, ScreenBlend, SoftLightBlend, SrcOverComposition } from 'react-native-image-filter-kit';
import { useSelector } from 'react-redux';
import { getImages } from './tmdb';
import { getVHLink, jsCode, scrapeView } from './scrape';
import WebView from 'react-native-webview';
  

const Home = (props) => {
  const state = useSelector(state => state)
  const isDarkMode = useColorScheme() === 'dark';
  const [scrollview, setScrollview] = useState(null);
  const [itemLocations, setItemLocations] = useState({});
  const [selected, setSelected] = useState({
    title: 'Spider',
    year: '2020',
    image: 'https://wallpaperbat.com/img/280720-top-movie-wallpaper.jpg'
  });
  const [url, setUrl] = useState('');

  const [lists, setLists] = useState([]);

  const currentUser = state.auth.auth.users.filter(user => user.uuid === state.auth.auth.currentUserUUID)[0];

  useEffect(() => {
    if (lists.map(list => list.title).indexOf('Continue Watching') === -1) {
      const continueWatchingItems = [];
      var moviesWatched = currentUser.moviesWatched.map(movie => movie.movie);
      moviesWatched = moviesWatched.filter((value, index, self) => self.findIndex(movie => movie.title === value.title) === index)

      moviesWatched.forEach(async movie => {
        const _images = await getImages(movie.ids.tmdb);
        const _link = await getVHLink(movie.title, movie.year);
        const background = 'https://image.tmdb.org/t/p/original/' + _images['backdrops'][0].file_path;
        continueWatchingItems.push({
          title: movie.title,
          year: movie.year,
          image: background,
          vhlink: _link
        });
      });

      setLists([{
        title: 'Continue Watching',
        items: continueWatchingItems
      }]);
    }
  }, [currentUser.moviesWatched, lists]);

  const checkForLink = (html) => {
    const link = scrapeView(html);
    if (link != '') {
      console.log(link);
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
              uri: selected.image,
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
                    <TouchableOpacity
                      key={item.title}
                      hasTVPreferredFocus={list.items[0] === item}
                      activeOpacity={.5}
                      onFocus={() => {
                        setSelected(item);
                        if (itemLocations[list.title] !== undefined) {
                          scrollview.scrollTo({ x: 0, y: itemLocations[list.title].y, animated: true });
                        }
                      }} 
                      onPress={() => {
                        setUrl(item.vhlink);
                      }}>
                      <Image
                      style={styles.smallCard}
                      source={{
                        uri: item.image,
                      }}></Image>
                    </TouchableOpacity>
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
          userAgent={'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15'}
          useWebKit={true}
          incognito={true}
          javaScriptEnabled={true}
          injectedJavaScript={jsCode}
          source={{uri: url}}
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
      backgroundColor: '#fff',
      borderRadius: 15,
      marginRight: 35,
    },
    webview: {
      opacity: 0,
      position: 'absolute',
    }
  });

export default Home;