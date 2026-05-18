import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput,
  Dimensions, FlatList, ActivityIndicator, Alert
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PRIMARYAPPCOLOR } from '../../utils/Colour/Color';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { DataContext } from '../../Context/DataProvider';
import axios from 'axios';
import { homePageStyle } from '../../Styles/CommonStyles';

const { width } = Dimensions.get('window');
const SPACING = 15;
const CARD_WIDTH = (width - (SPACING * 3)) / 2;
const WHITECOLOR = '#FFFFFF';

import ShimmerLoader from '../../components/ShimmerLoader';

const Home = () => {
    // ... no changes to state/logic ...
    // Note: I'm keeping the logic as is, just fixing styles
    const navigation = useNavigation();
    const CTX = useContext(DataContext);
    const [cart] = CTX.cartState;
    const [favourites] = CTX.favState;
    const { toggleFavourite } = CTX.favActions;

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState(''); // 'asc' or 'desc'
    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 10;

    const fetchCategories = async () => {
        try {
            const res = await axios.get('https://dummyjson.com/products/categories');
            setCategories([{ slug: '', name: 'All' }, ...res.data]);
        } catch (e) {
            console.error('Failed to fetch categories', e);
        }
    };

    const fetchProducts = async (pageNum = 0, isNew = false) => {
        if (loading || (!hasMore && !isNew)) return;
        setLoading(true);
        if (isNew) {
            setInitialLoading(true);
            setProducts([]); // Clear current list to force shimmer effect for new filter/search
        }

        try {
            let url = `https://dummyjson.com/products`;
            if (searchQuery) {
                url = `https://dummyjson.com/products/search?q=${searchQuery}&limit=${LIMIT}&skip=${pageNum * LIMIT}`;
            } else if (selectedCategory) {
                url = `https://dummyjson.com/products/category/${selectedCategory}?limit=${LIMIT}&skip=${pageNum * LIMIT}`;
            } else {
                url = `https://dummyjson.com/products?limit=${LIMIT}&skip=${pageNum * LIMIT}`;
            }

            if (sortOrder) {
                url += `&sortBy=price&order=${sortOrder}`;
            }

            const res = await axios.get(url);
            const fetchedProducts = res.data.products;

            setProducts(prev => isNew ? fetchedProducts : [...prev, ...fetchedProducts]);
            setHasMore(fetchedProducts.length === LIMIT);
            setPage(pageNum);
        } catch (e) {
            console.error('Failed to fetch products', e);
            Alert.alert("Error", "Failed to load products");
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        setHasMore(true);
        fetchProducts(0, true);
    }, [searchQuery, selectedCategory, sortOrder]);

    const loadMoreProducts = () => {
        if (!loading && hasMore) {
            fetchProducts(page + 1, false);
        }
    };

    const isFav = (id) => favourites.some(item => item.id === id);

    const renderFooter = () => {
        if (!loading || initialLoading) return null;
        return <ActivityIndicator size="large" color={PRIMARYAPPCOLOR} style={{ marginVertical: 20 }} />;
    };

    const HeaderComponent = () => (
        <>
            <View style={styles.header}>
                <View style={styles.locationRow}>
                    <Text style={styles.locationText}>Discover Products</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => navigation.navigate("Favouriteproducts")} style={[styles.bellBtn, {marginRight: 10}]}>
                        {favourites.length > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>{favourites.length}</Text>
                            </View>
                        )}
                        <Ionicons name="heart" size={20} color={PRIMARYAPPCOLOR} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.bellBtn}>
                        {cart.length > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>{cart.length}</Text>
                            </View>
                        )}
                        <FontAwesome5 name="shopping-cart" size={20} color={PRIMARYAPPCOLOR} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.searchRow}>
                <TextInput
                    placeholder="Search by product title..."
                    placeholderTextColor="#aaa"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
                <TouchableOpacity 
                    style={styles.filterBtn}
                    onPress={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                >
                    <Ionicons name={sortOrder === 'asc' ? "arrow-up" : "arrow-down"} size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Categories</Text>
            </View>

            <FlatList
                data={categories}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryContainer}
                renderItem={({ item }) => {
                    const isSelected = selectedCategory === item.slug;
                    return (
                        <TouchableOpacity 
                            style={[styles.categoryBtn, isSelected && { backgroundColor: PRIMARYAPPCOLOR }]} 
                            onPress={() => setSelectedCategory(item.slug)}
                        >
                            <Text style={[styles.categoryText, isSelected && { color: WHITECOLOR }]}>
                                {item.name || item.slug}
                            </Text>
                        </TouchableOpacity>
                    )
                }}
            />
            <View style={[styles.sectionRow, { marginBottom: 10 }]}>
                <Text style={styles.sectionTitle}>All Products</Text>
            </View>
        </>
    );

    const renderProductItem = ({ item }) => {
        const discountedPrice = item.price - (item.price * (item.discountPercentage / 100));
        return (
            <View style={styles.card}>
                <TouchableOpacity 
                    onPress={() => toggleFavourite(item)}
                    style={styles.heartIcon}>
                    <Ionicons
                        name="heart"
                        size={18}
                        color={isFav(item.id) ? '#FF4D4D' : '#CCCCCC'}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ProductInfo', { item })}>
                    <Image source={{ uri: item.thumbnail }} resizeMode={'contain'} style={styles.image} />
                    <Text style={styles.category}>{item.category}</Text>
                    <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={14} color="#f1c40f" />
                        <Text style={styles.rating}>{item.rating}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>${discountedPrice.toFixed(2)}</Text>
                        {item.discountPercentage > 0 && (
                            <Text style={styles.oldPrice}>${item.price.toFixed(2)}</Text>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    if (initialLoading || (loading && products.length === 0)) {
        return (
            <View style={styles.container}>
                <HeaderComponent />
                <ShimmerLoader />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                ListHeaderComponent={HeaderComponent}
                contentContainerStyle={styles.gridContainer}
                renderItem={renderProductItem}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                onEndReached={loadMoreProducts}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={!loading ? <Text style={styles.emptyText}>No products found.</Text> : null}
            />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITECOLOR,
  },
  header: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
    width: "100%"
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: PRIMARYAPPCOLOR,
    fontWeight: 'bold',
    marginHorizontal: 5,
    fontSize: 22,
  },
  bellBtn: {
    backgroundColor: '#F0EAE3',
    padding: 8,
    borderRadius: 10,
    position: 'relative'
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  cartBadgeText: {
    color: WHITECOLOR,
    fontSize: 10,
    fontWeight: 'bold'
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    color: '#000',
  },
  filterBtn: {
    backgroundColor: PRIMARYAPPCOLOR,
    marginLeft: 10,
    borderRadius: 10,
    padding: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3D3D3D',
  },
  categoryContainer: {
    paddingHorizontal: 15,
    marginBottom: "3%",
    marginVertical: 10,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    borderRadius: 20
  },
  categoryText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600'
  },
  gridContainer: {
    paddingBottom: 150,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  heartIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 20,
    elevation: 2,
  },
  category: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
    textTransform: 'capitalize'
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C9E5D',
    marginRight: 6,
  },
  oldPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    color: '#333'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888'
  }
});

