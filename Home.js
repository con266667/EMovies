import React from 'react';
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
  } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Navigation } from 'react-native-navigation';

import Header from './Header';
  

const Home = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View>
      <TouchableOpacity
        style={styles.feature}
        onPress={() => Navigation.push('Main', {
          component: {
            name: 'Movie',
            options: {
              topBar: {
                  visible: false,
              }
            }
          },
        })}
        underlayColor='#fff'>
          <Image
          style={styles.feature}
          source={{
            uri: 'https://image.tmdb.org/t/p/original/ga7IxkBBMopo7z6akBPvogj4EQI.jpg',
          }}></Image>
      </TouchableOpacity>
      <View height={50}></View>
      <Text style={styles.subtitle}>Continue Watching</Text>
      <View height={15}></View>
      <ScrollView 
        style={styles.showRow} 
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        >
        <TouchableOpacity
          activeOpacity={.5}
          style={styles.smallCard}
          onPress={() => {}}>
            <Image
            style={styles.smallCard}
            source={{
              uri: 'https://image.tmdb.org/t/p/original/ga7IxkBBMopo7z6akBPvogj4EQI.jpg',
            }}></Image>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={.5}
          style={styles.smallCard}
          onPress={() => {}}>
            <Image
            style={styles.smallCard}
            source={{
              uri: 'https://image.tmdb.org/t/p/original/ga7IxkBBMopo7z6akBPvogj4EQI.jpg',
            }}></Image>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={.5}
          style={styles.smallCard}
          onPress={() => {}}>
            <Image
            style={styles.smallCard}
            source={{
              uri: 'https://image.tmdb.org/t/p/original/ga7IxkBBMopo7z6akBPvogj4EQI.jpg',
            }}></Image>
        </TouchableOpacity>
      </ScrollView>
      <View height={50}></View>
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
      height: 400,
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 25,
    },
    subtitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 25,
      color: '#fff',
      opacity: 0.2,
    },
    showRow: {
      flexDirection: 'row',
    },
    smallCard: {
      height: 200,
      width: 300,
      backgroundColor: '#fff',
      borderRadius: 20,
      marginRight: 35,
    },
  });

export default Home;