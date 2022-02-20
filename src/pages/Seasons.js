import React from "react";
import { ActivityIndicator, findNodeHandle, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Episodes = (props) => {
    return (
        ((props.button === 'episodes' || props.episodeView) && props.selectedSeason !== 0) ?
        <View>
          <ScrollView 
              style={styles.seasons}
              showsVerticalScrollIndicator={false}
              opacity={(props.button === 'episodes' || props.episodeView) ? 1 : 0}
              >
              {(props.tmdbShow === null ? [] : props.tmdbShow.seasons.filter(season => season.season_number != 0)).map((season, index) => {
                return (
                  <TouchableOpacity
                    // hasTVPreferredFocus = {selectedSeason === season.season_number}
                    key={index}
                    onFocus={() => {
                        props.setEpisodeView(true);
                        props.setSeason(season.season_number);
                    }}
                    onBlur={() => {
                        props.setEpisodeView(false);
                    }}
                    nextFocusLeft={findNodeHandle(props.episodeButtonRef.current)}
                    ref={(ref) => {
                        if (props.seasonRefs[season.season_number] === undefined) {
                            props.seasonRefs[season.season_number] = ref;
                        }
                    }}
                    // nextFocusRight={firstEpisodeRef}
                    >
                    <View>
                      <Image 
                        style={styles.seasonImage}
                        source={
                          {uri: season.poster_path === null ? 'https://via.placeholder.com/300x450' : 'https://image.tmdb.org/t/p/w300/' + season.poster_path}
                        }
                      />
                    </View>
                  </TouchableOpacity>
                )
              })}
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
        height: '80%',
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