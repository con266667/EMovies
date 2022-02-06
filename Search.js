import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Search = () => {
    const [search, setSearch] = useState("");

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    return (
        <View style={styles.main}>
            <View style={styles.searchBar}>
                <Text style={styles.search}>{search.toLowerCase()}</Text>
                <TouchableOpacity
                    style={[{ justifyContent: "center", alignItems: "center" }]}
                    onPress={() => {
                        setSearch(search.substring(0, search.length - 1));
                    }}
                >
                    <Text>X</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.letters}>
                {
                    alphabet.map((letter, index) => {
                        return (
                            <TouchableOpacity 
                                key={index} 
                                style={styles.letterButton}
                                onPress={() => {
                                    setSearch(search +letter);
                                }} >
                                <Text style={styles.letter} >{letter}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
            <TouchableOpacity 
                style={styles.space}
                onPress={() => {
                    setSearch(search + " ");
                }} >
                <Text style={styles.letter}>SPACE</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        justifyContent: "center",
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

export default Search;