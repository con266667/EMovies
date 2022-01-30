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
    // const state = useSelector(state => state)
    // const jsCode = 'window.ReactNativeWebView.postMessage(document.documentElement.innerHTML)'
    // const jsCode = 'setTimeout(window.ReactNativeWebView.postMessage(document.documentElement.innerHTML), 10000)'

    // const jsCode = "window.waitForBridge = function(fn) { return (window.postMessage.length === 1) ? fn() : setTimeout(function() { window.waitForBridge(fn) }, 5) }; window.waitForBridge(function() { window.ReactNativeWebView.postMessage(document.documentElement.innerHTML); window.ReactNativeWebView.postMessage('VIDEOSRC:' + document.querySelector('video').src); });"

    const [jsCode, setCode] = React.useState("window.waitForBridge = function(fn) { return (window.postMessage.length === 1) ? fn() : setTimeout(function() { window.waitForBridge(fn) }, 5) }; window.waitForBridge(function() { window.ReactNativeWebView.postMessage(document.documentElement.innerHTML) });");
    const [url, setUrl] = React.useState('')
    const [isScraping, setIsScraping] = React.useState(false)

    const jsCodeV2 = "setTimeout(function(){window.location.href = document.getElementsByTagName('iframe')[0].src;}, 500);setTimeout(function(){window.location.href = document.getElementsByTagName('iframe')[0].src;}, 1000);setTimeout(function(){window.ReactNativeWebView.postMessage(document.documentElement.innerHTML)}, 1500);";
    // const jsCodeV3 = "window.location.href = document.getElementsByTagName('iframe')[0].src; window.location.href = document.getElementsByTagName('iframe')[0].src; window.ReactNativeWebView.postMessage(document.documentElement.innerHTML);";


    // const jsCodeV2 = "setTimeout(() => { window.ReactNativeWebView.postMessage( document.documentElement.innerHTML ); }, 10000)";

    scrapeView = async (html) => {
        // console.log(html);
        // const soup = new JSSoup(html);
        // const link = soup.find('video')['attrs']['src'];
        // console.log(link);
        // console.log(url);
        // soup = new JSSoup(html)
        // if (url.includes('https://hdmoviesb.com/')) {
        //     console.log("Scraping hdmoviesb.com")
        //     try {
        //         if (soup.find('iframe')['attrs']['src'].includes('watchsb.com')) {
        //             console.log("UPDATE");
        //             const newurl = soup.find('iframe')['attrs']['src']
        //             setCode("setTimeout(() => window.ReactNativeWebView.postMessage(document.documentElement.innerHTML), 500)")
        //             setUrl(newurl);
        //         }
        //     } catch (_) {}
        // } else if (url.includes('https://watchsb.com/')) {
        //     // console.log(html);
        //     console.log("Scraping watchsb.com");
        //     link = soup.find('video')['attrs']['src'];
        //     console.log(link);
        // }
    }

    scrapeViewV2 = async (html) => {
        // console.log(html);
        const soup = new JSSoup(html);
        const link = soup.find('video')['attrs']['src'];
        console.log(link);
    }

    useEffect(() => {
        scrape = async () => {
            setIsScraping(true)
            console.log("Scraping...")
            const response = await fetch('https://hdmoviesb.com/video/vice-episode-1-4951')
            const html = await response.text()
            var soup = new JSSoup(html);
            var _url = soup.find('iframe')['attrs']['src'];
            console.log(_url)
            setUrl('https://hdmoviesb.com/' + _url)
        }
        
        if(!isScraping) {
            // scrape()
        }
    });

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
                    scalesPageToFit={true}
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
