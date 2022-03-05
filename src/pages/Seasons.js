import React, { useRef, useState } from "react";
import { ActivityIndicator, Dimensions, findNodeHandle, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Episodes = (props) => {
   const [seasonLocations, setSeasonLocations] = useState({});
   const scrollview = useRef();
  //  const seasonLocations = {};

    return (
        ((props.button === 'episodes' || props.episodeView) && props.selectedSeason !== 0) ?
        <View>
          <ScrollView 
              // style={{paddingTop: Dimensions.get('window').height * 0.4}}
              showsVerticalScrollIndicator={false}
              opacity={(props.button === 'episodes' || props.episodeView) ? 1 : 0}
              ref={scrollview}
              >
                <View style={{paddingTop: Dimensions.get('window').height * 0.4}}/>
              {(!props.show ? [] : props.show.seasons.filter(season => season.number != 0)).map((season, index) => {
                return (
                  <TouchableOpacity
                    // hasTVPreferredFocus = {selectedSeason === season.number}
                    key={index}
                    onFocus={() => {
                      if (!props.episodeView) {
                        props.setEpisodeView(true);
                      }
                      props.setSeason(season.number);
                      scrollview.current.scrollTo({x: 0, y: seasonLocations[season.number].y - Dimensions.get('window').height * 0.4, animated: true});
                    }}
                    onBlur={() => {
                        props.setEpisodeView(false);
                    }}
                    nextFocusLeft={findNodeHandle(props.episodeButtonRef.current)}
                    ref={(ref) => {
                        if (props.seasonRefs[season.number] === undefined) {
                            props.seasonRefs[season.number] = ref;
                        }
                    }}
                    onLayout={(event) => {
                      const layout = event.nativeEvent.layout;
                      setSeasonLocations({ ...seasonLocations, [season.number]: layout });
                    }}
                    // nextFocusRight={firstEpisodeRef}
                    >
                    <View>
                      <Text style={styles.season}>{
                        ('Season ' + season.number)
                      }</Text>
                      {/* <Image 
                        style={styles.seasonImage}
                        source={
                          {uri: season.poster_path === null ? 'https://via.placeholder.com/300x450' : 'https://image.tmdb.org/t/p/w300/' + season.poster_path}
                        }
                      /> */}
                    </View>
                  </TouchableOpacity>
                )
              })}
              <View style={{paddingTop: Dimensions.get('window').height * 0.6}}/>
          </ScrollView>
          </View> : <View />
    );
}

const styles = StyleSheet.create({
    content: {
      flexDirection: 'row',
      width: '100%',
      height: '100%',
      position: 'absolute',
    }, 
    blur: {
      position: 'absolute',
    },
    loadingSmallCard: {
      marginTop: -115,
      marginRight: 200,
    },
    loadingResumeEpisode: {
      marginTop: -290,
      marginRight: 50,
    },
    progress: {
      marginTop: -5,
      marginLeft: 12,
      borderRadius: 5,
      backgroundColor: '#f02',
      height: 5,
    },
    progressBack: {
        marginTop: -20,
        marginLeft: 12,
        borderRadius: 5,
        backgroundColor: '#999',
        height: 5,
    },
    backgroundImage: {
      backgroundColor: '#000',
      opacity: 0.4,
      width: '100%',
      height: '100%',
    },
    overlay: {
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
    },
    seasons: {
        // height: '50%',
    },
    season: {
      fontFamily: 'Inter-Bold',
      fontSize: 20,
      color: '#fff',
    },
    episodes: {
        marginLeft: 10,
    },
    seasonImage: {
      width: 100,
      height: 150,
      borderRadius: 10,
      borderColor: '#000',
      margin: 10,
    },
    episodeImage: {
      width: 300,
      height: 150,
      borderRadius: 10,
      marginBottom: 8,
      marginTop: 10,
    },
    seasonName: {
      marginTop: 32,
      fontFamily: 'Inter-Bold',
      fontSize: 25,
      color: '#fff',
      marginBottom: 10,
    },
    seasonTitle: {
      marginTop: 32,
      fontFamily: 'Inter-Bold',
      fontSize: 16,
      color: '#fff',
      marginBottom: 10,
    },
    resumeView: {
      marginTop: 40,
      marginLeft: 50,
      width: 400
    },
    resumeImage: {
      width: 350,
      height: 220,
      borderRadius: 10,
    },
    resumeName: {
      fontFamily: 'Inter-Bold',
      fontSize: 20,
      color: '#fff',
      marginTop: 10,
      textShadowColor: 'rgba(0, 0, 0, 1)',
      textShadowOffset: {width: -1, height: 1},
      textShadowRadius: 10
    },
    resumeDescription: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: '#fff',
      textShadowColor: 'rgba(0, 0, 0, 1)',
      textShadowOffset: {width: -1, height: 1},
      textShadowRadius: 10
    }
});

export default Episodes;