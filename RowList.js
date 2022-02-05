/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useState } from 'react';
 import { Provider, useSelector } from 'react-redux';
 import { createStore } from 'redux';
 import PageReducer from './PageReducer';
 import { Navigation } from 'react-native-navigation';
 import Header from './Header';
 import Home from './Home';
 import MoviePage from './MoviePage';
 import { Dimensions, findNodeHandle, View } from 'react-native';
 
  
 
 const RowList = (props) => {
    const [itemLocations, setItemLocations] = useState({});

    return (
        <View key={props.list.title}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              setItemLocations({ ...itemLocations, [list.title]: layout });
            }}>
            <Text style={styles.subtitle}>{list.title}</Text>
            <View height={5}></View>
            <ScrollView
                fadingEdgeLength={10}
                style={styles.showRow} 
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                height={150}>
            {
                list.items.map((item) => 
                <View key={item.title}>
                    <TouchableOpacity
                    hasTVPreferredFocus={list.items[0] === item && list.title === 'Continue Watching'}
                    nextFocusLeft = {findNodeHandle(props.sideRef.current)}
                    activeOpacity={.5}
                    onFocus={() => {
                        // setSelected(item);
                        setSelected( Object.assign({}, item) );
                        if (itemLocations[list.title] !== undefined) {
                            scrollview.scrollTo({ x: 0, y: itemLocations[list.title].y, animated: true });
                        }
                    }} 
                    onPress={() => {
                        setLoadingMovie(item.title);
                        getMovie(item);
                    }}>
                    <Image
                    style={styles.smallCard}
                    source={{
                        uri: item.image,
                    }} />
                    </TouchableOpacity>
                    <ActivityIndicator 
                    style={styles.loadingSmallCard} 
                    size={80} color={'#fff'} 
                    opacity={loadingMovie === item.title ? 1 : 0} />
                </View>
                )
            } 
            </ScrollView>
        </View>
    )
 }
 
 export default RowList;
 