/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useEffect, useRef, useState } from 'react';
 import { Provider, useDispatch, useSelector } from 'react-redux';
 import { Dimensions, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
 import Search from '../../../assets/icons/search.svg';
 import TV from '../../../assets/icons/tv.svg';
 import Video from '../../../assets/icons/video.svg';
 import HomeIcon from '../../../assets/icons/home.svg';
 import { BlurView } from "@react-native-community/blur";
import Page from './components/Page';
 
 const Main = ({ navigation }) => {
    const state = useSelector(state => state);
    const dipatch = useDispatch();
    const [sidebarActive, setSidebarActive] = useState(false);
    const [scrollviewRef, setScrollviewRef] = useState(null);
    const [itemLocations, setItemLocations] = useState({});

    const setPage = (page) => {
        dipatch({ type: 'CHANGE_PAGE', payload: page });
        scrollToList(list(page)[0]);
        setSidebarActive(true);
    }

    const list = (page) => {
        try {
            return state.auth.auth.lists[state.auth.auth.currentUserUUID][page]['lists'];
        } catch (_) {
            return [];
        }
    }

    const scrollToList = (list) => {
        if (itemLocations[list.page + list.title] !== undefined) {
            scrollviewRef.scrollTo({ x: 0, y: itemLocations[list.page + list.title].y - 10, animated: true });
        }
    }
 
    const homeRef = useRef(null);
    const tvRef = useRef(null);
 
    return (
        <View style={styles.content}>
            <View style={styles.sidebar}>
                <TouchableWithoutFeedback
                    hasTVPreferredFocus={state.page.page.page === 'home'}
                    onFocus={() => setPage('home')} 
                    onBlur={() => setSidebarActive(false)}
                    ref={(ref) => homeRef.current = ref} >
                    <HomeIcon 
                        path={state.page.page.page === 'home' ? '#fff' : '#666'}
                        style={styles.icon} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback 
                    hasTVPreferredFocus={state.page.page.page === 'tv'}
                    onFocus={() => setPage('tv')} 
                    onBlur={() => setSidebarActive(false)}
                    ref={(ref) => tvRef.current = ref} >
                    <TV 
                        path={state.page.page.page === 'tv' ? '#fff' : '#666'} 
                        style={styles.icon} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback 
                    onFocus={() => setPage('Movies')} 
                    onBlur={() => setSidebarActive(false)}
                    hasTVPreferredFocus={state.page.page.page === 'Movies'} >
                    <Video 
                        path={state.page.page.page === 'Movies' ? '#fff' : '#666'} 
                        style={styles.icon} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback 
                    onFocus={() => setPage('Search')} 
                    onBlur={() => setSidebarActive(false)}
                    hasTVPreferredFocus={state.page.page.page === 'Search'} >
                    <Search 
                        path={state.page.page.page === 'Search' ? '#fff' : '#666'} 
                        style={styles.icon} />
                </TouchableWithoutFeedback>
            </View>
            <Page
                lists={[...list('home'), ...list('tv')]}  
                navigation={navigation}
                width={Dimensions.get('window').width - 68} 
                sideRef={homeRef} 
                scrollviewRef={scrollviewRef}
                setScrollviewRef={setScrollviewRef}
                itemLocations={itemLocations}
                setItemLocations={setItemLocations}
                scrollToList={scrollToList}
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
 