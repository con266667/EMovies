import React, { useCallback, useRef } from "react";
import { ActivityIndicator, findNodeHandle, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

const SmallCard = (props) => {
    const touchableRef = useRef(null);

    const onRef = useCallback((ref) => {
        if (ref) {
          touchableRef.current = ref;
          if (props.index === 0) {
            props.setListFirstRefs(prev => ({ ...prev, [props.list.page + props.list.title]: touchableRef }));
          }
        }
    }, [touchableRef]);

    const dispatch = useDispatch();

    const setPage = (page) => {
        if (props.state.page.page.page !== page) {
            dispatch({ type: 'CHANGE_PAGE', payload: page });
        }
    }

    return (
        <View key={props.list.title + props.index.toString() + props.item.title}>
            <TouchableOpacity
                nextFocusLeft = {props.index === 0 ? findNodeHandle(props.sideRefs[props.list.page].current) : null}
                nextFocusRight = {props.isLast ? findNodeHandle(touchableRef.current) : null}
                nextFocusUp = {props.isTopRow ? findNodeHandle(touchableRef.current) : null}
                onBlur={() => props.clearYoutubeKey()}
                activeOpacity={.2}
                onFocus={() => {
                    props.setSelected(props.item);
                    setPage(props.list.page);
                    props.scrollToList(props.list);
                }} 
                onPress={() => {
                    if (props.item.isMovie) {
                        props.item.open(props.navigation);
                    } else {
                        props.item.openShow(props.navigation);
                    }
                }}
                ref={onRef}>
            <Image
                style={styles.smallCard}
                source={{
                    uri: props.item.poster.replace('original', 'w500'),
                }} />
            {/* <View style={styles.progressBack} opacity={(props.item.progress(props.state) < 95 && props.item.progress(props.state) != 0) ? 1 : 0} width={175} height={5} />
            <View style={styles.progress} width={props.item.progress(props.state) < 95 ? props.item.progress(props.state) * 1.75 : 0} height={5} /> */}
            </TouchableOpacity>
            
            <ActivityIndicator 
                style={styles.loadingSmallCard} 
                size={80} color={'#fff'} 
                opacity={props.loadingMovie.title === props.item.title ? 1 : 0} />
        </View>
    )
};

const styles = StyleSheet.create({
    progress: {
        marginTop: -5,
        marginLeft: 12,
        borderRadius: 5,
        backgroundColor: '#f02',
        height: 5,
    },
    progressBack: {
        marginTop: -13,
        marginLeft: 12,
        borderRadius: 5,
        backgroundColor: '#999',
        height: 5,
    },
    smallCard: {
        height: 160,
        width: 105,
        borderRadius: 8,
        marginRight: 25,
    },
    loadingSmallCard: {
        marginTop: -104,
        marginRight: 33,
    },
});

export default SmallCard;