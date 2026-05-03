import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

// Falling back to default View-based shimmer if LinearGradient link is missing/causing errors
const ShimmerPlaceholder = createShimmerPlaceholder(); 
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 45) / 2;

const ShimmerLoader = () => {
    const renderCard = (index) => (
        <View key={index} style={styles.card}>
            <ShimmerPlaceholder style={styles.image} />
            <ShimmerPlaceholder style={styles.textLine1} />
            <ShimmerPlaceholder style={styles.textLine2} />
            <View style={styles.priceRow}>
                <ShimmerPlaceholder style={styles.price} />
                <ShimmerPlaceholder style={styles.rating} />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerShimmer}>
                <ShimmerPlaceholder style={styles.searchBar} />
            </View>
            <View style={styles.grid}>
                {[1, 2, 3, 4, 5, 6].map((i) => renderCard(i))}
            </View>
        </View>
    );
};

export default ShimmerLoader;

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#fff',
    },
    headerShimmer: {
        marginBottom: 20,
    },
    searchBar: {
        width: '100%',
        height: 45,
        borderRadius: 10,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 10,
        marginBottom: 20,
        elevation: 1,
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        marginBottom: 8,
    },
    textLine1: {
        width: '80%',
        height: 14,
        borderRadius: 4,
        marginBottom: 6,
    },
    textLine2: {
        width: '60%',
        height: 14,
        borderRadius: 4,
        marginBottom: 10,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    price: {
        width: '40%',
        height: 16,
        borderRadius: 4,
    },
    rating: {
        width: '20%',
        height: 16,
        borderRadius: 4,
    },
});
