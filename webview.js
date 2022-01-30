import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

const Webview = () => {
    const jsCode = "window.waitForBridge = function(fn) { return (window.postMessage.length === 1) ? fn() : setTimeout(function() { window.waitForBridge(fn) }, 5) }; window.waitForBridge(function() { window.postMessage(document.getElementById('gb-main').innerHTML) });"

    return (
        <WebView
            javaScriptEnabled={true}
            injectedJavaScript={jsCode}
            source={{uri: 'http://www.google.com/'}}
            onMessage={event => console.log('Received: ', event.nativeEvent.data)}
        />
    );
}

export default Webview;