import React, { useEffect, useRef, useState } from 'react';
import { findNodeHandle, Image, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMoviesLink } from './scrape';
import { getShowEpisodes } from './Trakt';
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

  const getShow = async (show, episode) => {
    const link = await getAllMoviesLink(show.title, show.year, episode.number, episode.season);
    setLoadingEpisode(episode);
    setUrl(link);
  }

  const handleLink = (link) => {
    setUrl('');
    const _episode = Object.assign({}, loadingEpisode);
    setLoadingEpisode({});
    props.openVideo(link, show(), _episode, props.show.progress ?? 0);
  }

  useEffect(() => {
    const getSeasons = async () => {
        const seasons = await getShowEpisodes(show().ids.trakt, dispatch);
        setSeasons(seasons);
    }

    if (seasons.length === 0) {
        getSeasons();
    }
  }, [seasons]);

  const episodeButtonRef = useRef(null);

  const show = () => {
    if (props.show.type === undefined) {
        return props.show;
    } else {
        return props.show[props.show.type === 'movie' ? 'movie' : 'show'];
    }
  }

  return (
    <View>
        <Webview url={url} handleLink={handleLink} />
        <Image
            style={styles.backgroundImage}
            source={{
                uri: videoImage(show().ids.imdb, state),
            }} />
        <View style={styles.overlay}>
          <Text style={styles.movieTitle}>{show().title}</Text>
          <Text style={styles.movieYear}>{show().year}</Text>
          <View height={80}></View>
          {}
          <TouchableWithoutFeedback
            onFocus={() => {setButton('play'); setEpisodeView(false); setSeason(0)}}
            onPress={() => {
              getShow(show(), props.show.episode === undefined ? seasons[0].episodes[0] : props.show.episode);
            }}
            onBlur={() => {setButton('')}}
            style={styles.textButton}
          >
            <View>
              <Text style={[styles.textButton, {opacity: (button === 'play') ? 1 : 0.2}]}>{
                props.show.episode === undefined ? 'Play Season 1 Episode 1' : ('Resume Season ' + props.show.episode.season + ' Episode ' + props.show.episode.number)
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
        <ScrollView 
            style={styles.seasons}
            showsVerticalScrollIndicator={false}
            opacity={(button === 'episodes' || episodeView) ? 1 : 0}
            >
            {(seasons === undefined ? [] : seasons.filter(season => season.number != 0)).map((season, index) => {
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onFocus={() => {
                      setEpisodeView(true);
                      setSeason(season.number);
                  }}
                  onBlur={() => {
                      setEpisodeView(false);
                  }}
                  nextFocusLeft={findNodeHandle(episodeButtonRef.current)}
                  ref={(ref) => {
                      // if (index === 0) {
                      //     season1Ref.current = ref;
                      // }

                      if (seasonRefs[season.number] === undefined) {
                          seasonRefs[season.number] = ref;
                      }
                  }}
                  // nextFocusRight={firstEpisodeRef}
                  >
                  <View>
                      <Text style={[styles.seasonTitle, {opacity: (season.number === selectedSeason) ? 1 : 0.2}]} >Season {season.number}</Text>
                  </View>
                </TouchableWithoutFeedback>
              )
            })}
        </ScrollView>
        { ((button === 'episodes' || episodeView) && selectedSeason !== 0) &&
        <ScrollView 
            style={styles.episodes}
            showsVerticalScrollIndicator={false}
            >
            {
            (selectedSeason <= 0 ? [] : seasons.filter(_season => _season.number === selectedSeason)[0].episodes).map((episode, index) => {
              return (
                <TouchableOpacity
                    key={index} 
                    onPress={() => {
                        setLoadingEpisode(episode);
                        getShow(show(), episode);
                    }}
                    nextFocusLeft={findNodeHandle(seasonRefs[selectedSeason])}
                    ref={(ref) => {
                        // if (index === 0 && firstEpisodeRefs[episode.season] === undefined) {
                        //     console.log(episode.season)
                        //     firstEpisodeRefs[episode.season] = ref;
                        // }
                    }}
                    >
                    <Text style={styles.seasonTitle}>{episode.title}</Text>
                </TouchableOpacity>
              )
            })}
        </ScrollView>
        }
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
    },
    seasons: {
        position: 'absolute',
        top: '10%',
        left: 300,
        height: '80%',
    },
    episodes: {
        position: 'absolute',
        top: '10%',
        left: 450,
        height: '80%',
    },
    seasonTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 16,
        color: '#fff',
        marginBottom: 10,
    }
});

export default TVShow;