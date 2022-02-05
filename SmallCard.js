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
        <View key={props.list.title + props.index.toString()}>
            <TouchableOpacity
                hasTVPreferredFocus = {props.isTopRow && props.index === 0}
                nextFocusLeft = {props.index === 0 ? findNodeHandle(props.sideRef.current) : null}
                nextFocusRight = {props.isLast ? findNodeHandle(touchableRef.current) : null}
                nextFocusUp = {props.isTopRow ? findNodeHandle(touchableRef.current) : null}
                activeOpacity={.2}
                onFocus={() => {
                    props.setSelected(props.item);
                    if (props.itemLocations[props.list.title] !== undefined) {
                        props.scrollview.scrollTo({ x: 0, y: props.itemLocations[props.list.title].y, animated: true });
                    }
                }} 
                onPress={() => {
                    if (props.item.movie) {
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
                    uri: videoImage(props.item.ids.trakt, props.state),
                }} />
            </TouchableOpacity>
            <ActivityIndicator 
                style={styles.loadingSmallCard} 
                size={80} color={'#fff'} 
                opacity={props.loadingMovie.title === props.item.title ? 1 : 0} />
        </View>
    )
};

const styles = StyleSheet.create({
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