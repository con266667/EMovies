import { BlurView } from '@react-native-community/blur';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, findNodeHandle, Image, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMoviesLink } from '../utils/Scrape';
import { getTmdbSeason, getTmdbShow } from '../utils/tmdb';
import { getPlayback, getShowEpisodes } from '../utils/Trakt';
import Episodes from './Episodes';
import Seasons from './Seasons';
import Webview from '../utils/Webview';
  

const TVShow = (props) => {
  const state = useSelector(state => state);
  const show = props.route.params.show;
  const dispatch = useDispatch();
  const [button, setButton] = useState('play');
  const [url, setUrl] = useState('');
  const [episodeView, setEpisodeView] = useState(false);
  const [selectedSeason, setSeason] = useState(0);
  const [loadingEpisode, setLoadingEpisode] = useState({});
  const [seasonRefs, setSeasonRefs] = useState({});
  const [seasons, setSeasons] = useState([]);
  const [playback, setPlayback] = useState(
    state.auth.auth.watchProgress[state.auth.auth.currentUserUUID]
    .filter(playback => playback.show !== undefined && playback.show.ids.trakt === show.ids.trakt)
    .sort((a, b) => Date(a.paused_at) - Date(b.paused_at)) ?? []);
  const [tmdbShow, setTmdbShow] = useState(null);
  const [tmdbFetch, setTmdbFetch] = useState(false);
  const [tmdbSeasons, setTmdbSeasons] = useState([]);

  const getShow = async (show, episode) => {
    // const link = await getAllMoviesLink(show.title, show.year, episode.number, episode.season);
    // setUrl(link);
    const _show = show;
    _show.episode = episode.number;
    _show.season = episode.season;
    _show.open(props.navigation);
  }

  const handleLink = (link) => {
    setUrl('');
    const _episode = Object.assign({}, loadingEpisode);
    setLoadingEpisode({});
    props.navigation.navigate('Player', {
      video: _episode,
      progress: playback.filter(playback => playback.episode.ids.trakt === _episode.ids.trakt)[0].progress,
      url: link,
    });
  }

  const currentUser = () => state.auth.auth.users.filter(user => user.uuid === state.auth.auth.currentUserUUID)[0];

  const getTmdb = async () => {
    setTmdbFetch(true);
    const tmdb = await getTmdbShow(show.ids.tmdb);
    setTmdbShow(tmdb);
    for (var i = 0; i < tmdb.seasons.length; i++) {
      const season = tmdb.seasons[i];
      const seasonData = await getTmdbSeason(show.ids.tmdb, season.season_number);
      setTmdbSeasons(tmdbSeasons => [...tmdbSeasons, seasonData]);
    }
  }

  useEffect(() => {
    const getSeasons = async () => {
        var seasons = await getShowEpisodes(show.ids.trakt, dispatch);
        if (seasons[0].number === 1) {
          seasons.unshift({
            number: 0,
          });
        }
        setSeasons(seasons);
    }

    const getPlaybackData = async () => {
      var _playback = await getPlayback(currentUser(), dispatch, state);
      _playback = _playback.filter(playback => playback.show !== undefined && playback.show.ids.trakt === show.ids.trakt).sort((a, b) => Date(a.paused_at) - Date(b.paused_at));
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

  const playbackEpisode = (season, episode) => {
    const _playback = playback.filter(_episode => _episode.episode.season === season && _episode.episode.number === episode);
    if (_playback.length > 0) {
      return _playback[0];
    } else {
      return null;
    }
  }

  const playbackResumeEpisode = () => {
    if (
      playback.length > 0
      && playback[0] !== undefined
      && seasons.length > playback[0].episode.season
    ) {
      if (playback[0].progress > 98) {
        return getNextEpisode(playback[0].episode);
      } else {
        return playback[0].episode;
      }
    } else {
      return null;
    }
  }

  const getNextEpisode = (episode) => {
    if (seasons[episode.season].episodes.length > episode.number) {
        return seasons[episode.season].episodes[episode.number];
    } else if (seasons.length > episode.season + 1) {
        return seasons[episode.season + 1].episodes[0];
    } else {
        return null;
    }
  }

  const resumeEpisode = () => {
    if (
      playbackResumeEpisode() !== null
      && tmdbSeasons.filter(_season => _season.season_number === playbackResumeEpisode().season).length > 0 
    ) {
      var nextEpisode = playbackResumeEpisode();
      return tmdbSeasons.filter(_season => _season.season_number === nextEpisode.season)[0].episodes.filter(_episode => _episode.episode_number === nextEpisode.number)[0];
    } 
    return null;
  }

  return (
    <View style={{backgroundColor: '#000'}}>
        <Webview url={url} handleLink={handleLink} />
        <Image
            style={styles.backgroundImage}
            source={{
                uri: show.backdrop,
            }} />
        <BlurView
            style={styles.blur}
            overlayColor='#000'
            blurType="dark"
            blurAmount={1}
        />
        <View style={styles.content}>
          <View style={styles.overlay}>
            <Text style={styles.movieTitle}>{show.title}</Text>
            <Text style={styles.movieYear}>{show.year}</Text>
            <View height={80}></View>
            <TouchableWithoutFeedback
              hasTVPreferredFocus = {true}
              onFocus={() => {setButton('play'); setEpisodeView(false); setSeason(0)}}
              onPress={() => {
                getShow(show, playbackResumeEpisode() === null ? seasons[0].episodes[0] : playbackResumeEpisode());
              }}
              onBlur={() => {setButton('')}}
              style={styles.textButton}
            >
              <View>
                <Text style={[styles.textButton, {opacity: (button === 'play') ? 1 : 0.2}]}>{
                  playbackResumeEpisode() === null ? 'Play Season 1 Episode 1' : ('Resume Season ' + playbackResumeEpisode().season + ' Episode ' + playbackResumeEpisode().number)
                }</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onFocus={() => {setButton('episodes'); setSeason(0)}}
              onBlur={() => {setEpisodeView(true); setSeason(0)}}
              nextFocusRight={seasonRefs[1] === undefined ? null : findNodeHandle(seasonRefs[1].current)}
              ref={(ref) => {episodeButtonRef.current = ref}}
              style={styles.textButton}>
            <View>
              <Text style={[styles.textButton, {opacity: (button === 'episodes') ? 1 : 0.2}]}>Episodes</Text>
            </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onFocus={() => {setButton('back'); setEpisodeView(false); setSeason(0)}}
              onBlur={() => {setButton('')}}
              onPress={() => {
                props.navigation.goBack();
              }}
              style={styles.textButton}
            >
              <View>
                <Text style={[styles.textButton, {opacity: (button === 'back') ? 1 : 0.2}]}>Back</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          {
            (button === 'play' && resumeEpisode() !== null) &&
            <View style={styles.resumeView}>
              <Image
                style={styles.resumeImage}
                source={
                  {uri: 'https://image.tmdb.org/t/p/w500/' + resumeEpisode().still_path}
                } />
                <View opacity={playback[0] !== null && playback[0].progress < 98 ? 1 : 0}>
                  <View style={styles.progressBack} width={325} height={5} />
                  <View style={styles.progress} width={playback[0] !== null ? playback[0].progress * 3.25 : 0} height={5} />
                </View>
                <Text style={styles.resumeName}>
                  {resumeEpisode().name}
                </Text>
                <Text style={styles.resumeDescription}>
                  {resumeEpisode().overview}
                </Text>
                <ActivityIndicator 
                  style={styles.loadingResumeEpisode} 
                  size={120} color={'#fff'} 
                  opacity={loadingEpisode === playbackResumeEpisode() ? 1 : 0} 
                />
            </View>
          }
          <Seasons 
            button={button} 
            tmdbShow={tmdbShow}
            setEpisodeView={setEpisodeView}
            setSeason={setSeason}
            episodeButtonRef={episodeButtonRef}seasonName
            seasonRefs={seasonRefs}
          />
          <Episodes 
            button={button} 
            loadingEpisode={loadingEpisode} 
            playbackEpisode={playbackEpisode} 
            tmdbSeasons={tmdbSeasons} 
            getShow={getShow} 
            show={show} 
            seasons={seasons} 
            episodeView={episodeView} 
            selectedSeason={selectedSeason} 
            seasonRefs={seasonRefs} />
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

export default TVShow;