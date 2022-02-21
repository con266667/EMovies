import React, { useRef, useState } from "react";
import { Dimensions, findNodeHandle, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { searchMulti } from "../../utils/tmdb";
import { searchShow } from "../../utils/Trakt";

const SearchPage = (props) => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const updateResults = async (query) => {
        try {
            const newResults = await searchMulti(query);
            setResults(newResults);
        } catch (_){}
        setSearch(query);
    }

    const openShow = async (show) => {
        const shows = (await searchShow(show)).filter(s => s.show.title.toLowerCase() === show.toLowerCase());
        props.openShow(shows[0]);
    }

    const firstResultRef = useRef(null);

    return (
        <View style={styles.main} opacity={props.opacity}>
            <View style={{justifyContent: "center"}} >
                <View style={styles.searchBar}>
                    <Text style={styles.search}>{search.toLowerCase()}</Text>
                    <TouchableOpacity
                        style={[{ justifyContent: "center", alignItems: "center" }]}
                        onPress={() => {
                            updateResults(search.substring(0, search.length - 1));
                        }}
                    >
                        <Text opacity={search.length > 0 ? 1 : 0} style={{color:'#fff'}}>X</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.letters}>
                    {
                        alphabet.map((letter, index) => {
                            const _ref = useRef(null);
                            return (
                                <TouchableOpacity 
                                    key={index} 
                                    style={styles.letterButton}
                                    onPress={() => {
                                        updateResults(search + letter);
                                    }} 
                                    ref={(ref) => {
                                        _ref.current = ref;
                                        props.setLetterRefs(prev => ({...prev, [letter]: _ref}));
                                    }} 
                                    nextFocusLeft = {index % 6 === 0 ? findNodeHandle(props.sideRef.current) : null}
                                    nextFocusRight = {index % 6 === 5 ? findNodeHandle(firstResultRef.current) : null}
                                    >
                                    <Text style={styles.letter} >{letter}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                    { props.letterRefs['Z'] !== undefined &&
                    <TouchableOpacity 
                        style={styles.space}
                        nextFocusLeft={findNodeHandle(props.letterRefs['Z'].current)}
                        onPress={() => {
                            setSearch(search + " ");
                        }} >
                        <Text style={styles.letter}>SPACE</Text>
                    </TouchableOpacity>
                    }
                </View>
            </View>
            <ScrollView style={{margin: 10}} showsVerticalScrollIndicator={false} height={Dimensions.get('window').height}>
                <View style={styles.results}>
                {
                    results.filter(r => r.poster_path !== undefined && r.popularity > 5 && r.original_language === 'en').map((result, index) => {
                        return (
                            <TouchableOpacity 
                                key={index}
                                onPress={() => {
                                    openShow(result.name);
                                }}
                                nextFocusLeft={index % 4 === 0 ? findNodeHandle(props.letterRefs['F'].current) : null}
                                ref={(ref) => {
                                    if (index === 0) {
                                        firstResultRef.current = ref;
                                    }
                                }}>
                                <Image
                                    style={styles.poster}
                                    source={{ uri: `https://image.tmdb.org/t/p/w500${result.poster_path}` }}
                                />
                            </TouchableOpacity>
                        )
                    })
                }
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        justifyContent: "center",
        alignContent: "center",
        flexDirection: "row",
    },

    results: {
        width: 500,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        marginTop: 50,
    },

    poster: {
        width: 100,
        height: 150,
        margin: 10,
        borderRadius: 10,
    }, 

    searchBar: {
        flexDirection: "row",
        marginBottom: 10,
    },

    letters: {
        width: 300,
        flexDirection: "row",
        flexWrap: "wrap",
        // justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 20,
    },

    letterButton: {
        width: 40,
        height: 40,
    },

    space: {
        // alignItems: "end",
        marginLeft: 20,
        width: 80,
        height: 40,
    },

    letter: {
        fontFamily: 'Inter-Bold',
        fontSize: 20,
        color: '#fff',
    },

    search: {
        width: 200,
        fontFamily: 'Inter-Bold',
        fontSize: 20,
        color: '#888',
        marginLeft: 20,
    }
});

export default SearchPage;