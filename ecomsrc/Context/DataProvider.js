import React, { createContext, useState, useEffect } from "react";
import EncryptedStorage from "react-native-encrypted-storage";
import Toast from 'react-native-toast-message';

export const DataContext = createContext();

const DataProvider = (props) => {
    // ... no changes to state ...
    const [cart, setCart] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [UserData, SetUserData] = useState({});

    useEffect(() => {
        const loadLocalData = async () => {
            try {
                const storedCart = await EncryptedStorage.getItem('cart');
                const storedFavs = await EncryptedStorage.getItem('favourites');
                if (storedCart) setCart(JSON.parse(storedCart));
                if (storedFavs) setFavourites(JSON.parse(storedFavs));
            } catch (e) {
                console.error("Failed to load local data", e);
            }
        };
        loadLocalData();
    }, []);

    useEffect(() => {
        EncryptedStorage.setItem('cart', JSON.stringify(cart)).catch(e => console.log(e));
    }, [cart]);

    useEffect(() => {
        EncryptedStorage.setItem('favourites', JSON.stringify(favourites)).catch(e => console.log(e));
    }, [favourites]);

    const addToCart = (product, quantity = 1) => {
        if (!product) return;
        const finalQty = Number(quantity) || 1;
        
        if (product.stock < finalQty) {
            return { success: false, message: 'Stock not available!' };
        }

        setCart(prev => {
            const exists = prev.find(item => item.id === product.id);
            
            if (exists) {
                return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + finalQty } : item);
            }
            return [...prev, { ...product, qty: finalQty }];
        });
        return { success: true, message: 'Added to cart successfully!' };
    };

    const removeFromCart = (productId) => {
        setCart(prev => {
             const exist = prev.find(item => item.id === productId);
             if(exist) {
                Toast.show({
                    type: 'info',
                    text1: 'Removed from Cart',
                    text2: `${exist.title} has been removed`
                });
             }
             return prev.filter(item => item.id !== productId);
        });
    };

    const updateCartQty = (productId, qty) => {
        if (qty <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prev => prev.map(item => item.id === productId ? { ...item, qty } : item));
    };

    const toggleFavourite = (product) => {
        setFavourites(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                Toast.show({ type: 'info', text1: 'Removed from Favourites' });
                return prev.filter(item => item.id !== product.id);
            }
            Toast.show({ type: 'success', text1: 'Added to Favourites' });
            return [...prev, product];
        });
    };

    const moveToFavourites = (product) => {
        toggleFavourite(product);
        removeFromCart(product.id);
    };

    const clearCart = async () => {
        setCart([]);
        try {
            await EncryptedStorage.removeItem('cart');
        } catch (e) {
            console.log("Error clearing storage", e);
        }
    };

    const value = {
        cartState: [cart, setCart],
        favState: [favourites, setFavourites],
        userDataState: [UserData, SetUserData],
        cartActions: { addToCart, removeFromCart, updateCartQty, moveToFavourites, clearCart },
        favActions: { toggleFavourite },
    };

    return (
        <DataContext.Provider value={value}>
            {props.children}
        </DataContext.Provider>
    );
};

export default DataProvider;