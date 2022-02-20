/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useEffect, useRef, useState } from 'react';
 import { Provider, useDispatch, useSelector } from 'react-redux';
 import HomeView from './HomeView';
 import { Dimensions, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
 import Search from '../../../assets/icons/search.svg';
 import TV from '../../../assets/icons/tv.svg';
 import Video from '../../../assets/icons/video.svg';
 import HomeIcon from '../../../assets/icons/home.svg';
 import { BlurView } from "@react-native-community/blur";
 
 const Main = ({ navigation }) => {
    const state = useSelector(state => state);
    const dipatch = useDispatch();
    const [sidebarActive, setSidebarActive] = useState(false);

    const setPage = (page) => {
        dipatch({ type: 'CHANGE_PAGE', payload: page });
        setSidebarActive(true);
    }
 
    const homeRef = useRef(null);
    const tvRef = useRef(null);
 
    return (
        <View style={styles.content}>
            <View style={styles.sidebar}>
                <TouchableWithoutFeedback
                    hasTVPreferredFocus={state.page.page.page === 'Home'}
                    onFocus={() => setPage('Home')} 
                    onBlur={() => setSidebarActive(false)}
                    ref={(ref) => homeRef.current = ref} >
                    <HomeIcon 
                        path={state.page.page.page === 'Home' ? '#fff' : '#666'}
                        style={styles.icon} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback 
                    hasTVPreferredFocus={state.page.page.page === 'TV'}
                    onFocus={() => setPage('TV')} 
                    onBlur={() => setSidebarActive(false)}
                    ref={(ref) => tvRef.current = ref} >
                    <TV 
                        path={state.page.page.page === 'TV' ? '#fff' : '#666'} 
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
            <HomeView page={state.page.page.page} navigation={navigation} homeRef={homeRef} tvRef={tvRef} />
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
 