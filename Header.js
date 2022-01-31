import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { changePage } from './PageActions';
import ReactNative, {
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
  } from 'react-native';

import { useSelector } from 'react-redux'

  

const Header = (props) => {
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  const pushPage = page => dispatch({ type: 'CHANGE_PAGE', payload: page })

  const isActive = page => state.page.page === page;

  return (
    <View style={styles.header}>        
        <TouchableOpacity
            onFocus={() => {
                pushPage('For You')
            }}
            // style={{opacity: (isActive('For You')) ? 0.2 : 1}}
        >
            <Text style={styles.headingText}>For You</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onFocus={() => {
                pushPage('Movies')
            }}
            // style={{opacity: (isActive('Movies')) ? 0.2 : 1}}
        >
            <Text style={styles.headingText}>Movies</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onFocus={() => {
                pushPage('TV Shows')
            }}
            
            // style={{opacity: (isActive('TV Shows')) ? 0.2 : 1}}
        >
            <Text style={styles.headingText}>TV Shows</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: 'row',
    },
    headingText: {
        fontFamily: "Inter-SemiBold",
        fontSize: 25,
        color: '#fff',
        marginRight: 60,
    }
});

export default Header;