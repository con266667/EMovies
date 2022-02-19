import React, { useState } from 'react';
import ReactNative, {
  Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useColorScheme,
    View,
  } from 'react-native';
  

const MoviePage = () => {
  const state = useState('')
  const [button, setButton] = state;

  return (
    <View>
        <Image
        style={styles.backgroundImage}
        source={{
          uri: 'https://image.tmdb.org/t/p/original/ga7IxkBBMopo7z6akBPvogj4EQI.jpg',
        }}
        ></Image>
        <View style={styles.overlay}>
          <Text style={styles.movieTitle}>Movie Title</Text>
          <Text style={styles.movieYear}>1888</Text>
          <View height={80}></View>
          <TouchableWithoutFeedback
            onFocus={() => {setButton('play')}}
            onBlur={() => {setButton('')}}

            style={styles.textButton}
          >
            <View>
              <Text style={[styles.textButton, {opacity: (button === 'play') ? 1 : 0.2}]}>Play</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onFocus={() => {setButton('trailer')}}
            onBlur={() => {setButton('')}}

            style={styles.textButton}
          >
            <View>
              <Text style={[styles.textButton, {opacity: (button === 'trailer') ? 1 : 0.2}]}>Trailer</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onFocus={() => {setButton('back')}}
            onBlur={() => {setButton('')}}
            onPress={() => {
              Navigation.pop('Main');
            }}

            style={styles.textButton}
          >
            <View>
              <Text style={[styles.textButton, {opacity: (button === 'back') ? 1 : 0.2}]}>Back</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    backgroundImage: {
      opacity: 0.2,
      width: '100%',
      height: '100%',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      padding: 30
    },
    movieTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 30,
      color: '#fff',
    },
    movieYear: {
      fontFamily: 'Inter-Regular',
      fontSize: 20,
      color: '#fff',
    },
    textButton: {
      fontFamily: 'Inter-Bold',
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
      opacity: 0.8,
    }
});

export default MoviePage;