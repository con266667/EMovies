/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { createStore } from 'redux';
import PageReducer from './PageReducer';
import { Navigation } from 'react-native-navigation';
import Header from './Header';
import Home from './Home';
import MoviePage from './MoviePage';
import HomeView from './HomeView';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import WebView from 'react-native-webview';
import JSSoup from 'jssoup'; 



store = createStore(PageReducer);

const backgroundStyle = {
    backgroundColor: Colors.darker,
};

const App = () => {
    const jsCodeV2 = "setTimeout(function(){window.location.href = document.getElementsByTagName('iframe')[0].src;}, 800);setTimeout(function(){window.location.href = document.getElementsByTagName('iframe')[0].src;}, 1600);setTimeout(function(){window.ReactNativeWebView.postMessage(document.documentElement.innerHTML)}, 2400);";

    scrapeViewV2 = async (html) => {
        const soup = new JSSoup(html);
        const link = soup.find('video')['attrs']['src'];
        console.log(link);
    }

    return (
        <Provider store={store}>
            {/* <SafeAreaView style={backgroundStyle}> */}
                <WebView
                    style={styles.webview}
                    originWhitelist={['*']}
                    javaScriptEnabledAndroid={true}
                    userAgent={'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15'}
                    useWebKit={true}
                    incognito={true}
                    javaScriptEnabled={true}
                    injectedJavaScript={jsCodeV2}
                    source={{uri: 'https://vhmovies.com/movie/the-mule-2018-2Xbh/watching.html?ep=0'}}
                    onMessage={event => scrapeViewV2(event.nativeEvent.data)}
                />
                {/* <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle, styles.wrap}>
                <View height={15}></View>
                <Header />
                <View height={25}></View>
                <HomeView />
                </ScrollView> */}
            {/* </SafeAreaView> */}
        </Provider>
    );
};


const styles = StyleSheet.create({
    wrap: {
        paddingHorizontal: 60,
        paddingVertical: 20,
    },
    webview: {
        marginTop: 20, 
        width: Dimensions.get('window').width, 
        height: Dimensions.get('window').height
    }
});

export default App;
