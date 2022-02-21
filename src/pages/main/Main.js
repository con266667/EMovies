/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useEffect, useRef, useState } from 'react';
 import { Provider, useDispatch, useSelector } from 'react-redux';
 import { Dimensions, findNodeHandle, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
 import TV from '../../../assets/icons/tv.svg';
 import Video from '../../../assets/icons/video.svg';
 import HomeIcon from '../../../assets/icons/home.svg';
 import Search from '../../../assets/icons/search.svg';
 import { BlurView } from "@react-native-community/blur";
 import SearchPage from './Search';
 import Page from './components/Page';
 
 const Main = ({ navigation }) => {
    const state = useSelector(state => state);
    const dipatch = useDispatch();
    const [sidebarActive, setSidebarActive] = useState(false);
    const [scrollviewRef, setScrollviewRef] = useState(null);
    const [itemLocations, setItemLocations] = useState({});
    const [listFirstRefs, setListFirstRefs] = useState({});

    const setPage = (page) => {
        dipatch({ type: 'CHANGE_PAGE', payload: page });
        scrollToList(list().find(list => list.page === page));
        // setSidebarActive(true);
    }

    const list = () => {
        try {
            return state.auth.auth.lists[state.auth.auth.currentUserUUID]['lists'];
        } catch (_) {
            return [];
        }
    }

    const scrollToList = (list) => {
        try {
            scrollviewRef.scrollTo({ x: 0, y: itemLocations[list.page + list.title].y - 10, animated: true });
        } catch (_) {}
    }

    const sideRefs = {
        'home': useRef(null),
        'tv': useRef(null),
        'movies': useRef(null),
        'search': useRef(null),
    }

    // try {
    //     console.log(listFirstRefs['tvRecently Watched'].current)
    // } catch (_) {
    //     console.log(_)
    // }
 
    return (
        <View style={styles.content}>
            <View style={styles.sidebar}>
                {listFirstRefs['homeRecently Watched'] !== undefined &&
                <TouchableOpacity
                    // hasTVPreferredFocus={state.page.page.page === 'home'}
                    onFocus={() => setPage('home')} 
                    nextFocusRight={findNodeHandle(listFirstRefs['homeRecently Watched'].current)}
                    // onBlur={() => setSidebarActive(false)}
                    ref={(ref) => sideRefs.home.current = ref} >
                    <HomeIcon 
                        path={state.page.page.page === 'home' ? '#fff' : '#666'}
                        style={styles.icon} />
                </TouchableOpacity>
                }
                {listFirstRefs['tvRecently Watched'] !== undefined &&
                <TouchableOpacity 
                    onFocus={() => setPage('tv')} 
                    nextFocusRight={findNodeHandle(listFirstRefs['tvRecently Watched'].current)}
                    ref={(ref) => sideRefs.tv.current = ref} >
                    <TV 
                        path={state.page.page.page === 'tv' ? '#fff' : '#666'} 
                        style={styles.icon} />
                </TouchableOpacity>
                }
                {listFirstRefs['moviesTrending'] !== undefined &&
                <TouchableOpacity 
                    onFocus={() => setPage('movies')} 
                    nextFocusRight={findNodeHandle(listFirstRefs['moviesTrending'].current)}
                    ref={(ref) => sideRefs.movies.current = ref}>
                    <Video 
                        path={state.page.page.page === 'movies' ? '#fff' : '#666'} 
                        style={styles.icon} />
                </TouchableOpacity>
                }
                <TouchableWithoutFeedback 
                    onFocus={() => setPage('search')} 
                    onBlur={() => setSidebarActive(false)} >
                    <Search 
                        path={state.page.page.page === 'search' ? '#fff' : '#666'} 
                        style={styles.icon} />
                </TouchableWithoutFeedback>
            </View>
            
            <Page
                opacity={state.page.page.page !== 'search' ? 1 : 0}
                lists={list()}  
                navigation={navigation}
                width={Dimensions.get('window').width - 68} 
                sideRefs={sideRefs} 
                scrollviewRef={scrollviewRef}
                setScrollviewRef={setScrollviewRef}
                itemLocations={itemLocations}
                setListFirstRefs={setListFirstRefs}
                listFirstRefs={listFirstRefs}
                setItemLocations={setItemLocations}
                scrollToList={scrollToList}
            />
            <SearchPage
                opacity={state.page.page.page === 'search' ? 1 : 0}
                navigation={navigation}
            />
            {/* <View opacity={sidebarActive ? 1 : 0} style={styles.over}>
                <BlurView
                    style={styles.absolute}
                    overlayColor=''
                    blurType="dark"
                    blurAmount={3}
                />
            </View> */}
        </View>
    );
 };
 
 
 const styles = StyleSheet.create({
    over: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
     absolute: {
         position: "absolute",
         top: 0,
         left: 60,
         bottom: 0,
         right: 0
     },
     wrap: {
         paddingHorizontal: 60,
         paddingVertical: 60,
     },
     webview: {
         opacity: 0,
         width: Dimensions.get('window').width, 
         height: Dimensions.get('window').height
     },
     content: {
         flex: 1,
         flexDirection: 'row',
         backgroundColor: 'rgb(18, 18, 18)',
     },
     sidebar: {
         justifyContent: 'center',
         alignItems: 'center',
         marginRight: 8,
         width: 60,
     },
     sidebarItem: {
         fontFamily: 'Inter-SemiBold',
         color: '#fff',
         marginVertical: 10,
     },
     icon: {
         marginVertical: 20,
     }
 });
 
 export default Main;
 