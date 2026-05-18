import React, { useContext, useState } from 'react';
import {
    View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { DataContext } from '../../Context/DataProvider';
import { PRIMARYAPPCOLOR } from '../../utils/Colour/Color';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const ProductInfo = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { item } = route.params || {};

    const CTX = useContext(DataContext);
    const { addToCart } = CTX.cartActions;
    const { toggleFavourite } = CTX.favActions;
    const [favourites] = CTX.favState;

    const [isReadMore, setIsReadMore] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    if (!item) {
        return <View style={styles.container}><Text>No Product Data</Text></View>;
    }

    const isFav = favourites.some(fav => fav.id === item.id);
    const discountedPrice = item.price - (item.price * (item.discountPercentage / 100));

    const handleAddToCart = () => {
        const res = addToCart(item, 1);
        if (res?.success === false) {
            Alert.alert("Warning", res.message);
        } else {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Added to Cart successfully'
            });
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.cartBtn}>
                    <Ionicons name="cart" size={24} color={PRIMARYAPPCOLOR} />
                </TouchableOpacity>
            </View>

            {/* Carousel images */}
            <View style={{ position: 'relative' }}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={(e) => setActiveImageIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
                    scrollEventThrottle={16}
                >
                    {item.images?.map((img, index) => (
                        <Image key={index} source={{ uri: img }} style={styles.image} resizeMode="contain" />
                    ))}
                </ScrollView>
                <View style={styles.pagination}>
                    {item.images?.map((_, i) => (
                        <View key={i} style={[styles.dot, activeImageIndex === i && styles.activeDot]} />
                    ))}
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    <TouchableOpacity onPress={() => toggleFavourite(item)}>
                        <Ionicons name={isFav ? "heart" : "heart-outline"} size={28} color={isFav ? "red" : "#888"} />
                    </TouchableOpacity>
                </View>

                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={16} color="gold" />
                    <Text style={styles.rating}>{item.rating} Rating</Text>
                </View>

                <View style={styles.priceRow}>
                    <Text style={styles.price}>${discountedPrice.toFixed(2)}</Text>
                    {item.discountPercentage > 0 && <Text style={styles.oldPrice}>${item.price.toFixed(2)}</Text>}
                    <Text style={styles.discountBadge}>{item.discountPercentage}% OFF</Text>
                </View>

                <Text style={styles.description}>
                    {isReadMore ? item.description : `${item.description.substring(0, 80)}...`}
                    <Text style={styles.readMore} onPress={() => setIsReadMore(!isReadMore)}>
                        {isReadMore ? ' Show Less' : ' Read More'}
                    </Text>
                </Text>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Product Information</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Brand</Text>
                    <Text style={styles.infoValue}>{item.brand}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Stock</Text>
                    <Text style={styles.infoValue}>{item.availabilityStatus} ({item.stock} left)</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Warranty</Text>
                    <Text style={styles.infoValue}>{item.warrantyInformation}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Return Policy</Text>
                    <Text style={styles.infoValue}>{item.returnPolicy}</Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Reviews</Text>
                {item.reviews?.map((review, i) => (
                    <View key={i} style={styles.reviewBox}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={14} color="gold" />
                                <Text style={styles.reviewRating}>{review.rating}</Text>
                            </View>
                            <Text style={styles.reviewerName}>{review.reviewerName}</Text>
                        </View>
                        <Text style={styles.reviewComment}>{review.comment}</Text>
                    </View>
                ))}
            </View>

            <View style={{ height: 100 }} />

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.btnFav} onPress={() => toggleFavourite(item)}>
                    <Text style={styles.btnTextBlack}>{isFav ? 'Remove from Favourites' : 'Add to Favourites'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnAdd} onPress={handleAddToCart}>
                    <Text style={styles.btnTextWhite}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ProductInfo;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        position: 'absolute', top: 10, left: 0, right: 0, flexDirection: 'row',
        justifyContent: 'space-between', paddingHorizontal: 15, zIndex: 10
    },
    backBtn: { backgroundColor: '#fff', padding: 8, borderRadius: 20, elevation: 5 },
    cartBtn: { backgroundColor: '#fff', padding: 8, borderRadius: 20, elevation: 5 },
    image: { width, height: 300 },
    pagination: { flexDirection: 'row', position: 'absolute', bottom: 10, alignSelf: 'center' },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc', marginHorizontal: 4 },
    activeDot: { backgroundColor: PRIMARYAPPCOLOR, width: 12 },
    content: { padding: 20 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: '700', flex: 1, color: '#333' },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    rating: { marginLeft: 5, fontSize: 14, color: '#555' },
    priceRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
    price: { fontSize: 24, fontWeight: 'bold', color: '#2C9E5D' },
    oldPrice: { fontSize: 16, color: '#999', textDecorationLine: 'line-through', marginLeft: 10 },
    discountBadge: { marginLeft: 10, backgroundColor: '#FFEDED', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, color: 'red', fontWeight: 'bold', fontSize: 12 },
    description: { fontSize: 15, color: '#666', lineHeight: 22 },
    readMore: { fontWeight: 'bold', color: PRIMARYAPPCOLOR },
    divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    infoLabel: { fontSize: 14, color: '#777' },
    infoValue: { fontSize: 14, color: '#111', fontWeight: '500' },
    reviewBox: { backgroundColor: '#F9F9F9', padding: 12, borderRadius: 10, marginBottom: 10 },
    reviewRating: { fontWeight: 'bold', fontSize: 13, marginLeft: 5 },
    reviewerName: { fontSize: 13, color: '#555', fontWeight: '500' },
    reviewComment: { marginTop: 5, fontSize: 14, color: '#333' },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: '#fff', padding: 15, elevation: 10 },
    btnFav: { flex: 1, borderWidth: 1, borderColor: PRIMARYAPPCOLOR, padding: 15, borderRadius: 10, alignItems: 'center', marginRight: 10 },
    btnAdd: { flex: 1, backgroundColor: PRIMARYAPPCOLOR, padding: 15, borderRadius: 10, alignItems: 'center' },
    btnTextBlack: { color: PRIMARYAPPCOLOR, fontWeight: 'bold', fontSize: 14 },
    btnTextWhite: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
