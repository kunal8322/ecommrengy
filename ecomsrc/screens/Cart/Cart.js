import React, { useContext } from 'react';
import {
    View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DataContext } from '../../Context/DataProvider';
import { PRIMARYAPPCOLOR } from '../../utils/Colour/Color';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const Cart = () => {
    const navigation = useNavigation();
    const CTX = useContext(DataContext);
    const [cart] = CTX.cartState;
    const [favourites] = CTX.favState;
    const { updateCartQty, removeFromCart, moveToFavourites, clearCart } = CTX.cartActions;

    const totalPrice = cart.reduce((sum, item) => {
        const discountedPrice = item.price - (item.price * (item.discountPercentage / 100));
        return sum + (discountedPrice * item.qty);
    }, 0);

    const totalActualPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discountAmount = totalActualPrice - totalPrice;

    const handleMinus = (item) => {
        if (item.qty <= (item.minimumOrderQuantity || 1)) {
            Alert.alert(
                "Remove Item",
                "Are you sure you want to remove this item?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Yes", onPress: () => removeFromCart(item.id) }
                ]
            );
        } else {
            updateCartQty(item.id, item.qty - 1);
        }
    };

    const handlePlus = (item) => {
        if (item.qty >= item.stock) {
            Alert.alert("Stock Limit", "Maximum available stock reached.");
        } else {
            updateCartQty(item.id, item.qty + 1);
        }
    };

    const renderItem = ({ item }) => {
        const discountedPrice = item.price - (item.price * (item.discountPercentage / 100));
        return (
            <View style={styles.card}>
                <Image source={{ uri: item.thumbnail }} style={styles.image} resizeMode="contain" />
                <View style={styles.cardBody}>
                    <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
                    <Text style={styles.price}>${discountedPrice.toFixed(2)}</Text>

                    <View style={styles.actionRow}>
                        <View style={styles.qtyRow}>
                            <TouchableOpacity onPress={() => handleMinus(item)} style={styles.qtyBtn}>
                                <Text style={styles.qtyText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.qtyValue}>{`${item.qty}`}</Text>
                            <TouchableOpacity onPress={() => handlePlus(item)} style={styles.qtyBtn}>
                                <Text style={styles.qtyText}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.iconBtn}>
                            <Ionicons name="trash" size={20} color="red" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => moveToFavourites(item)} style={[styles.iconBtn, { marginLeft: 5 }]}>
                            <Ionicons name="heart" size={20} color={PRIMARYAPPCOLOR} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Cart</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.statsRow}>
                <Text style={styles.statText}>Cart: {cart.length} items</Text>
                <Text style={styles.statText}>Favourites: {favourites.length} items</Text>
            </View>

            <FlatList
                data={cart}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 15 }}
                ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty.</Text>}
            />

            {cart.length > 0 && (
                <View style={styles.priceSplitCart}>
                    <Text style={styles.paymentSummaryTitle}>Payment Summary</Text>

                    <View style={styles.splitRow}>
                        <Text style={styles.splitLabel}>Total MRP</Text>
                        <Text style={styles.splitValue}>${totalActualPrice.toFixed(2)}</Text>
                    </View>
                    <View style={styles.splitRow}>
                        <Text style={styles.splitLabel}>Discount on MRP</Text>
                        <Text style={[styles.splitValue, { color: 'green' }]}>- ${discountAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.splitRow}>
                        <Text style={styles.splitLabel}>Shipping Fee</Text>
                        <Text style={[styles.splitValue, { color: 'green' }]}>FREE</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.checkoutBtn}
                        onPress={() => {
                            clearCart(); // Clear state and storage
                            Toast.show({
                                type: 'success',
                                text1: 'Order Placed!',
                                text2: 'Your order has been placed successfully.'
                            });
                            // Use reset to ensure we go back to the start and tabs are fresh
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'TabNavigation' }],
                                })
                            );
                        }}
                    >
                        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default Cart;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8F8' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', elevation: 2 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#EFEFEF' },
    statText: { fontSize: 14, fontWeight: '600', color: '#555' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
    card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 15, elevation: 1 },
    image: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#f9f9f9' },
    cardBody: { flex: 1, marginLeft: 15, justifyContent: 'center' },
    title: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    price: { fontSize: 16, fontWeight: '700', color: '#2C9E5D', marginVertical: 4 },
    actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
    qtyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 20 },
    qtyBtn: { paddingHorizontal: 12, paddingVertical: 4 },
    qtyText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    qtyValue: { fontSize: 16, fontWeight: '600', paddingHorizontal: 6, color: '#000' },
    iconBtn: { backgroundColor: '#f5f5f5', padding: 8, borderRadius: 20 },
    priceSplitCart: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 10 },
    paymentSummaryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    splitRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    splitLabel: { fontSize: 14, color: '#555' },
    splitValue: { fontSize: 14, fontWeight: '600', color: '#333' },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#000' },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: PRIMARYAPPCOLOR },
    checkoutBtn: { backgroundColor: PRIMARYAPPCOLOR, padding: 15, borderRadius: 10, alignItems: 'center' },
    checkoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
