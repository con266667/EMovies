import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { jsCode, scrapeView } from './scrape';

const Webview = (props) => {

    const checkForLink = (html) => {
        const link = scrapeView(html);
        if (link != '') {
          props.handleLink(link);
        }
    }

    return (
        <WebView
            style={styles.webview}
            originWhitelist={['*']}
            javaScriptEnabledAndroid={true}
            userAgent={'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15'}
            useWebKit={true}
            incognito={true}
            javaScriptEnabled={true}
            injectedJavaScript={jsCode}
            source={{
                uri: props.url,
            }}
            onMessage={event => checkForLink(event.nativeEvent.data)} 
        />
    );
}

const styles = StyleSheet.create({
    webview: {
        opacity: 0,
        color: '#000',
        backgroundColor: '#000',
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
    },
});

export default Webview;