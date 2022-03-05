import { BlurView } from '@react-native-community/blur';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, findNodeHandle, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getTmdbSeason, getTmdbShow } from '../utils/tmdb';
import Episodes from './Episodes';
import Seasons from './Seasons';
import Season from '../classes/Season';
  

const TVShow = (props) => {
  const state = useSelector(state => state);
  const [show, setShow] = useState(props.route.params.show);
  const [button, setButton] = useState('play');
  const [episodeView, setEpisodeView] = useState(false);
  const [selectedSeason, setSeason] = useState(0);
  const [watchNext, setWatchNext] = useState(null);
  const [seasonRefs, setSeasonRefs] = useState({});
  const playback =
    state.auth.auth.watchProgress[state.auth.auth.currentUserUUID]
    .filter(playback => playback.show !== undefined && playback.show.ids.trakt === show.ids.trakt)
    .sort((a, b) => Date(a.paused_at) - Date(b.paused_at)) ?? [];
  const [tmdbFetch, setTmdbFetch] = useState(false);

  const getShow = async (show, episode) => {
    const _show = show;
    _show.episode = episode.number;
    _show.season = episode.season;
    _show.open(props.navigation);
  }

  const getTmdb = async () => {
    setTmdbFetch(true);
    const tmdb = await getTmdbShow(show.ids.tmdb);
    const seasons = [];
    for (var i = 0; i < tmdb.seasons.length; i++) {
      const seasonData = await getTmdbSeason(show.ids.tmdb, tmdb.seasons[i].season_number);
      seasons.push(new Season(seasonData));
    }
    const _show = show;
    _show.seasons = seasons;
    setWatchNext(_show.watchNext(state));
    setShow(_show);
  }

  useEffect(() => {
    if (!tmdbFetch) {
      getTmdb();
    }

  }, [tmdbFetch]);

  const episodeButtonRef = useRef(null);

  return (
    <View style={{backgroundColor: '#000'}}>
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
                getShow(show, watchNext ?? show.getEpisode(1, 1));
              }}
              onBlur={() => {setButton('')}}
              style={styles.textButton}>
              <View>
                <Text style={[styles.textButton, {opacity: (button === 'play') ? 1 : 0.2}]}>{
                  !watchNext ? 'Play Season 1 Episode 1' : ('Resume Season ' + watchNext.season + ' Episode ' + watchNext.number)
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
              style={styles.textButton}>
              <View>
                <Text style={[styles.textButton, {opacity: (button === 'back') ? 1 : 0.2}]}>Back</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          {
            (button === 'play' && watchNext) &&
            <View style={styles.resumeView}>
              <Image
                style={styles.resumeImage}
                source={
                  {uri: 'https://image.tmdb.org/t/p/w500/' + watchNext.image ?? ''}
                } />
                <View opacity={playback[0] !== null && playback[0] > 0 && playback[0].progress < 95 ? 1 : 0}>
                  <View style={styles.progressBack} width={325} height={5} />
                  <View style={styles.progress} width={playback[0] !== null ? playback[0].progress * 3.25 : 0} height={5} />
                </View>
                <Text style={styles.resumeName}>
                  {watchNext.name}
                </Text>
                <Text style={styles.resumeDescription}>
                  {watchNext.description}
                </Text>
            </View>
          }
          <Seasons 
            button={button} 
            show={show}
            setEpisodeView={setEpisodeView}
            setSeason={setSeason}
            episodeButtonRef={episodeButtonRef}
            seasonRefs={seasonRefs}
          />
          <Episodes 
            button={button} 
            getShow={getShow} 
            show={show} 
            state={state}
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