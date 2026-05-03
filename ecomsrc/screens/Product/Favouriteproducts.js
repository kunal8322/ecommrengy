import React, { useContext, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DataContext } from '../../Context/DataProvider';
import { PRIMARYAPPCOLOR } from '../../utils/Colour/Color';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const Favouriteproducts = () => {
    // ... no changes to start ...
    const navigation = useNavigation();
    const CTX = useContext(DataContext);
    const [favourites] = CTX.favState;
    const { toggleFavourite } = CTX.favActions;
    const { addToCart } = CTX.cartActions;

    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState(''); // 'asc' or 'desc'
    const [page, setPage] = useState(1);
    const LIMIT = 10;

    const [filteredFavourites, setFilteredFavourites] = useState([]);
    const [displayedFavourites, setDisplayedFavourites] = useState([]);

    useEffect(() => {
        let result = [...favourites];
        
        if (searchQuery) {
            result = result.filter(item => 
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (sortOrder === 'asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'desc') {
            result.sort((a, b) => b.price - a.price);
        }

        setFilteredFavourites(result);
        setPage(1); // Reset pagination for new search or sort
    }, [favourites, searchQuery, sortOrder]);

    useEffect(() => {
        // Mock infinite scroll slice
        setDisplayedFavourites(filteredFavourites.slice(0, page * LIMIT));
    }, [filteredFavourites, page]);

    const loadMore = () => {
        if (displayedFavourites.length < filteredFavourites.length) {
            setPage(prev => prev + 1);
        }
    };

    const handleAddToCart = (item) => {
        const res = addToCart(item, item.minimumOrderQuantity || 1);
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

    const renderItem = ({ item }) => {
        const discountedPrice = item.price - (item.price * (item.discountPercentage / 100));
        
        return (
            <View style={styles.card}>
                <TouchableOpacity onPress={() => navigation.navigate('ProductInfo', { item })}>
                    <Image source={{ uri: item.thumbnail }} style={styles.image} resizeMode="contain" />
                </TouchableOpacity>
                <View style={styles.cardBody}>
                    <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>${discountedPrice.toFixed(2)}</Text>
                        {item.discountPercentage > 0 && <Text style={styles.oldPrice}>${item.price.toFixed(2)}</Text>}
                    </View>

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.btnOutline} onPress={() => toggleFavourite(item)}>
                            <Text style={styles.btnOutlineText}>Remove</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnPrimary} onPress={() => handleAddToCart(item)}>
                            <Text style={styles.btnPrimaryText}>Add to Cart</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 5}}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Favourites</Text>
                <View style={{width: 24}}/>
            </View>

            <View style={styles.searchRow}>
                <TextInput
                    placeholder="Search favourites..."
                    placeholderTextColor="#aaa"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity 
                    style={styles.filterBtn}
                    onPress={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                >
                    <Ionicons name={sortOrder === 'asc' ? "arrow-up" : "arrow-down"} size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={displayedFavourites}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 15 }}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={<Text style={styles.emptyText}>No matching favourites found.</Text>}
            />
        </View>
    );
};

export default Favouriteproducts;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8F8' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', elevation: 2 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
    searchRow: { flexDirection: 'row', alignItems: 'center', margin: 15 },
    searchInput: { flex: 1, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 15, height: 45, color: '#000', elevation: 1 },
    filterBtn: { backgroundColor: PRIMARYAPPCOLOR, marginLeft: 10, borderRadius: 10, padding: 10, elevation: 1 },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
    card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 15, elevation: 1 },
    image: { width: 90, height: 90, borderRadius: 8, backgroundColor: '#f9f9f9' },
    cardBody: { flex: 1, marginLeft: 15, justifyContent: 'center' },
    title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    priceRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
    price: { fontSize: 16, fontWeight: '700', color: '#2C9E5D' },
    oldPrice: { fontSize: 13, color: '#999', textDecorationLine: 'line-through', marginLeft: 8 },
    actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
    btnOutline: { flex: 1, borderWidth: 1, borderColor: '#ccc', paddingVertical: 8, borderRadius: 6, alignItems: 'center', marginRight: 5 },
    btnOutlineText: { color: '#555', fontWeight: 'bold', fontSize: 12 },
    btnPrimary: { flex: 1.5, backgroundColor: PRIMARYAPPCOLOR, paddingVertical: 8, borderRadius: 6, alignItems: 'center', marginLeft: 5 },
    btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});
