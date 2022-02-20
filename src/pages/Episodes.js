import React from "react";
import { ActivityIndicator, findNodeHandle, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Episodes = (props) => {
    return (
        ((props.button === 'episodes' || props.episodeView) && props.selectedSeason !== 0) ?
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.seasonName} > {'Season ' + props.selectedSeason} </Text>
            <ScrollView 
                style={styles.episodes}
                showsVerticalScrollIndicator={false}
                >
                {
                ((props.selectedSeason <= 0 || props.tmdbSeasons.filter(_season => _season.season_number === props.selectedSeason).length === 0) ? [] : props.tmdbSeasons.filter(_season => _season.season_number === props.selectedSeason)[0].episodes).map((episode, index) => {
                  return (
                    <View key={index} >
                      <Image
                        style={styles.episodeImage}
                        source={
                          {uri: episode.still_path === null ? 'https://via.placeholder.com/300x450' : 'https://image.tmdb.org/t/p/w500/' + episode.still_path}
                        } />
                      <View>
                        <View style={styles.progressBack} opacity={props.playbackEpisode(props.selectedSeason, index + 1) !== null ? 1 : 0} width={275} height={5} />
                        <View style={styles.progress} width={props.playbackEpisode(props.selectedSeason, index + 1) !== null ? props.playbackEpisode(props.selectedSeason, index + 1).progress * 2.75 : 0} height={5} />
                      </View>
                      <ActivityIndicator 
                        style={styles.loadingSmallCard} 
                        size={80} color={'#fff'} 
                        opacity={props.loadingEpisode === props.seasons[props.selectedSeason].episodes[index] ? 1 : 0} 
                        />
                      <TouchableOpacity
                          // activeOpacity={0.5}
                          onPress={() => {
                              props.getShow(props.show, props.seasons[props.selectedSeason].episodes[index]);
                          }}
                          nextFocusLeft={findNodeHandle(props.seasonRefs[props.selectedSeason])}
                          ref={(ref) => {
                              // if (index === 0 && firstEpisodeRefs[episode.season] === undefined) {
                              //     console.log(episode.season)
                              //     firstEpisodeRefs[episode.season] = ref;
                              // }
                          }}
                          >
                          <View>
                            <Text style={styles.seasonTitle}>{(index + 1).toString() + ": " + episode.name}</Text>
                          </View>
                      </TouchableOpacity>
                    </View>
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