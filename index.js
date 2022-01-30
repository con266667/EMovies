/**
 * @format
 */

import {AppRegistry} from 'react-native';
import { Navigation } from 'react-native-navigation';
import App from './App';
import {name as appName} from './app.json';
import Home from './Home';
import Login from './Login';
import MoviePage from './MoviePage';
import TraktOverlay from './TraktOverlay';
import getTitle from './scrape';

// getTitle();

// AppRegistry.registerComponent(appName, () => App);
Navigation.registerComponent('Main', () => App);
Navigation.registerComponent('Home', () => Home);
Navigation.registerComponent('Movie', () => MoviePage);
Navigation.registerComponent('Login', () => Login);
Navigation.registerComponent('TraktOverlay', () => TraktOverlay);

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: 'Main',
                            id: 'Main',
                            options: {
                                topBar: {
                                    visible: false,
                                }
                            }
                        }
                    }
                ]
            }
        }
    });
});