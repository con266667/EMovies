import React, { useCallback, useRef } from "react";
import { ActivityIndicator, findNodeHandle, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { videoImage } from "./VideoInfo";

const SmallCard = (props) => {
    const touchableRef = useRef(null);

    const onRef = useCallback((ref) => {
        if (ref) {
          touchableRef.current = ref;
        }
    }, []);

    const item = () => {
        if (props.item.type === undefined) {
            return props.item;
        } else {
            return props.item[props.item.type === 'movie' ? 'movie' : 'show'];
        }
    }

    return (
        <View key={props.list.title + props.index.toString() + item().title}>
            <TouchableOpacity
                // hasTVPreferredFocus = {props.isTopRow && props.index === 0}
                nextFocusLeft = {props.index === 0 ? findNodeHandle(props.sideRef.current) : null}
                nextFocusRight = {props.isLast ? findNodeHandle(touchableRef.current) : null}
                nextFocusUp = {props.isTopRow ? findNodeHandle(touchableRef.current) : null}
                activeOpacity={.2}
                onFocus={() => {
                    props.setSelected(item());
                    if (props.itemLocations[props.list.title] !== undefined) {
                        props.scrollview.scrollTo({ x: 0, y: props.itemLocations[props.list.title].y - 10, animated: true });
                    }
                }} 
                onPress={() => {
                    if (props.state.videoInfo.videoInfo.isMovie[item().ids.imdb]) {
                        props.setLoadingMovie(item());
                        props.getMovie(item());
                    } else {
                        props.openShow(props.item);
                    }
                }}
                ref={onRef}>
            <Image
                style={styles.smallCard}
                source={{
                    uri: videoImage(item().ids.imdb, props.state),
                }} />
            <View style={styles.progressBack} opacity={props.item.progress !== undefined ? 1 : 0} width={175} height={5} />
            <View style={styles.progress} width={props.item.progress !== undefined ? props.item.progress * 1.75 : 0} height={5} />
            </TouchableOpacity>
            
            <ActivityIndicator 
                style={styles.loadingSmallCard} 
                size={80} color={'#fff'} 
                opacity={props.loadingMovie.title === item().title ? 1 : 0} />
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
        height: 130,
        width: 200,
        borderRadius: 15,
        marginRight: 25,
    },
    loadingSmallCard: {
        marginTop: -104,
        marginRight: 33,
    },
});

export default SmallCard;