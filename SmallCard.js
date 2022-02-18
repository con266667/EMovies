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

    return (
        <View key={props.list.title + props.index.toString() + props.item.title}>
            <TouchableOpacity
                // hasTVPreferredFocus = {props.isTopRow && props.index === 0}
                nextFocusLeft = {props.index === 0 ? findNodeHandle(props.sideRef.current) : null}
                nextFocusRight = {props.isLast ? findNodeHandle(touchableRef.current) : null}
                nextFocusUp = {props.isTopRow ? findNodeHandle(touchableRef.current) : null}
                activeOpacity={.2}
                onFocus={() => {
                    props.setSelected(props.item);
                    if (props.itemLocations[props.list.title] !== undefined) {
                        props.scrollview.scrollTo({ x: 0, y: props.itemLocations[props.list.title].y - 10, animated: true });
                    }
                }} 
                onPress={() => {
                    if (props.item.isMovie) {
                        props.setLoadingMovie(props.item);
                        props.getMovie(props.item);
                    } else {
                        props.openShow(props.item);
                    }
                }}
                ref={onRef}>
            <Image
                style={styles.smallCard}
                source={{
                    uri: props.item.videoImage(props.state),
                }} />
            <View style={styles.progressBack} opacity={(props.item.progress(props.state) < 95 && props.item.progress(props.state) != 0) ? 1 : 0} width={175} height={5} />
            <View style={styles.progress} width={props.item.progress(props.state) < 95 ? props.item.progress(props.state) * 1.75 : 0} height={5} />
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