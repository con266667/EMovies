import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, findNodeHandle, Image, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMoviesLink } from './scrape';
import { getTmdbSeason, getTmdbShow } from './tmdb';
import { getPlayback, getShowEpisodes } from './Trakt';
import { videoImage } from './VideoInfo';
import Webview from './webview';
  

const TVShow = (props) => {
  const state = useSelector(state => state)
  const dispatch = useDispatch();
  const [button, setButton] = useState('play');
  const [url, setUrl] = useState('');
  const [episodeView, setEpisodeView] = useState(false);
  const [selectedSeason, setSeason] = useState(0);
  const [loadingEpisode, setLoadingEpisode] = useState({});
  const [seasonRefs, setSeasonRefs] = useState({});
  const [seasons, setSeasons] = useState([]);
  const [playback, setPlayback] = useState([]);
  const [tmdbShow, setTmdbShow] = useState(null);
  const [tmdbFetch, setTmdbFetch] = useState(false);
  const [tmdbSeasons, setTmdbSeasons] = useState([]);

  const getShow = async (show, episode) => {
    const link = await getAllMoviesLink(show.title, show.year, episode.number, episode.season);
    setLoadingEpisode(episode);
    setUrl(link);
  }

  const handleLink = (link) => {
    setUrl('');
    const _episode = Object.assign({}, loadingEpisode);
    setLoadingEpisode({});
    props.openVideo(link, show(), _episode, playbackEpisode(_episode.season, _episode.number) === null ? 0 : playbackEpisode(_episode.season, _episode.number).progress, seasons);
  }

  const currentUser = () => state.auth.auth.users.filter(user => user.uuid === state.auth.auth.currentUserUUID)[0];

  const getTmdb = async () => {
    setTmdbFetch(true);
    const tmdb = await getTmdbShow(show().ids.tmdb);
    setTmdbShow(tmdb);
    for (var i = 0; i < tmdb.seasons.length; i++) {
      const season = tmdb.seasons[i];
      const seasonData = await getTmdbSeason(show().ids.tmdb, season.season_number);
      setTmdbSeasons(tmdbSeasons => [...tmdbSeasons, seasonData]);
    }
  }

  useEffect(() => {
    const getSeasons = async () => {
        const seasons = await getShowEpisodes(show().ids.trakt, dispatch);
        setSeasons(seasons);
    }

    const getPlaybackData = async () => {
      var _playback = await getPlayback(currentUser(), dispatch, state);
      _playback = _playback.filter(playback => playback.show !== undefined && playback.show.ids.trakt === show().ids.trakt).sort((a, b) => Date(a.paused_at) - Date(b.paused_at));
      setPlayback(_playback);
    }

    if (seasons.length === 0) {
        getSeasons();
    }

    if (playback.length === 0) {
      getPlaybackData();
    }

    if (!tmdbFetch) {
      getTmdb();
    }

  }, [seasons, playback, tmdbFetch]);

  const episodeButtonRef = useRef(null);

  const show = () => {
    if (props.show.type === undefined) {
        return props.show;
    } else {
        return props.show[props.show.type === 'movie' ? 'movie' : 'show'];
    }
  }

  const playbackEpisode = (season, episode) => {
    const _playback = playback.filter(_episode => _episode.episode.season === season && _episode.episode.number === episode);
    if (_playback.length > 0) {
      return _playback[0];
    } else {
      return null;
    }
  }

  return (
    <View style={{backgroundColor: '#000'}}>
        <Webview url={url} handleLink={handleLink} />
        <Image
            style={styles.backgroundImage}
            source={{
                uri: videoImage(show().ids.imdb, state),
            }} />
        <View style={styles.content}>
          <View style={styles.overlay}>
            <Text style={styles.movieTitle}>{show().title}</Text>
            <Text style={styles.movieYear}>{show().year}</Text>
            <View height={80}></View>
            <TouchableWithoutFeedback
              hasTVPreferredFocus = {true}
              onFocus={() => {setButton('play'); setEpisodeView(false); setSeason(0)}}
              onPress={() => {
                getShow(show(), props.show.episode === undefined ? seasons[0].episodes[0] : props.show.episode);
              }}
              onBlur={() => {setButton('')}}
              style={styles.textButton}
            >
              <View>
                <Text style={[styles.textButton, {opacity: (button === 'play') ? 1 : 0.2}]}>{
                  playback.length === 0 ? 'Play Season 1 Episode 1' : ('Resume Season ' + playback[0].episode.season + ' Episode ' + playback[0].episode.number)
                }</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onFocus={() => {setButton('episodes'); setSeason(0)}}
              onBlur={() => {setEpisodeView(true); setSeason(0)}}
              nextFocusRight={seasonRefs[1] === undefined ? null : findNodeHandle(seasonRefs[1].current)}
              ref={(ref) => {episodeButtonRef.current = ref}}
              style={styles.textButton}
            >
            <View>
              <Text style={[styles.textButton, {opacity: (button === 'episodes') ? 1 : 0.2}]}>Episodes</Text>
            </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onFocus={() => {setButton('back'); setEpisodeView(false); setSeason(0)}}
              onBlur={() => {setButton('')}}
              onPress={() => {
                Navigation.pop(props.componentId);
              }}
              style={styles.textButton}
            >
              <View>
                <Text style={[styles.textButton, {opacity: (button === 'back') ? 1 : 0.2}]}>Back</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View>
          <ScrollView 
              style={styles.seasons}
              showsVerticalScrollIndicator={false}
              opacity={(button === 'episodes' || episodeView) ? 1 : 0}
              >
              {(tmdbShow === null ? [] : tmdbShow.seasons.filter(season => season.season_number != 0)).map((season, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onFocus={() => {
                        setEpisodeView(true);
                        setSeason(season.season_number);
                    }}
                    onBlur={() => {
                        setEpisodeView(false);
                    }}
                    nextFocusLeft={findNodeHandle(episodeButtonRef.current)}
                    ref={(ref) => {
                        // if (index === 0) {
                        //     season1Ref.current = ref;
                        // }

                        if (seasonRefs[season.season_number] === undefined) {
                            seasonRefs[season.season_number] = ref;
                        }
                    }}
                    // nextFocusRight={firstEpisodeRef}
                    >
                    <View>
                      <Image 
                        style={[styles.seasonImage, {borderWidth: (season.season_number === selectedSeason) ? 3 : 0}]}
                        source={
                          {uri: season.poster_path === null ? 'https://via.placeholder.com/300x450' : 'https://image.tmdb.org/t/p/w300/' + season.poster_path}
                        }
                      />
                    </View>
                  </TouchableOpacity>
                )
              })}
          </ScrollView>
          </View>
          { ((button === 'episodes' || episodeView) && selectedSeason !== 0) &&
          <ScrollView 
              style={styles.episodes}
              showsVerticalScrollIndicator={false}
              >
              {
              ((selectedSeason <= 0 || tmdbSeasons.filter(_season => _season.season_number === selectedSeason).length === 0) ? [] : tmdbSeasons.filter(_season => _season.season_number === selectedSeason)[0].episodes).map((episode, index) => {
                return (
                  <View key={index} >
                    <Image
                      style={styles.episodeImage}
                      source={
                        {uri: episode.still_path === null ? 'https://via.placeholder.com/300x450' : 'https://image.tmdb.org/t/p/w500/' + episode.still_path}
                      } />
                    <View>
                      <View style={styles.progressBack} opacity={playbackEpisode(selectedSeason, index + 1) !== null ? 1 : 0} width={275} height={5} />
                      <View style={styles.progress} width={playbackEpisode(selectedSeason, index + 1) !== null ? playbackEpisode(selectedSeason, index + 1).progress * 2.75 : 0} height={5} />
                    </View>
                    <ActivityIndicator 
                      style={styles.loadingSmallCard} 
                      size={80} color={'#fff'} 
                      opacity={loadingEpisode === seasons[selectedSeason].episodes[index] ? 1 : 0} 
                      />
                    <TouchableOpacity
                        // activeOpacity={0.5}
                        onPress={() => {
                            setLoadingEpisode(seasons[selectedSeason].episodes[index]);
                            getShow(show(), seasons[selectedSeason].episodes[index]);
                        }}
                        nextFocusLeft={findNodeHandle(seasonRefs[selectedSeason])}
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
          }
        </View>
    </View>
  );
};


const styles = StyleSheet.create({
    content: {
      flexDirection: 'row',
      width: '100%',
      height: '100%',
      position: 'absolute',
    }, 
    loadingSmallCard: {
      marginTop: -115,
      marginRight: 200,
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
        marginLeft: 20,
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
    seasonTitle: {
      marginTop: 32,
        fontFamily: 'Inter-Bold',
        fontSize: 16,
        color: '#fff',
        marginBottom: 10,
    },
});

export default TVShow;