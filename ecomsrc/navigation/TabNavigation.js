import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home/Home';
import Favouriteproducts from '../screens/Product/Favouriteproducts';
import { LIGHTGREYNCOLOR, PRIMARYAPPCOLOR, SECOUNDARYAPPCOLOR, WHITECOLOR } from '../utils/Colour/Color';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    return (
        <Tab.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: WHITECOLOR,
                    justifyContent: "center",
                    alignSelf: "center",
                    alignItems: "center",
                    height: 70,
                    position: 'absolute',
                    bottom: 30,
                    width: '90%',
                    marginLeft: "5%",
                    borderRadius: 20,
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarItemStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: "5%"
                },
            }}
        >
            <Tab.Screen
                name="HomeScreen"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Animatable.View
                            animation="zoomInUp"
                            duration={600}
                            style={{
                                backgroundColor: focused ? PRIMARYAPPCOLOR : WHITECOLOR,
                                height: 50,
                                width: 50,
                                borderRadius: 25,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <FontAwesome
                                name="home"
                                color={focused ? LIGHTGREYNCOLOR : SECOUNDARYAPPCOLOR}
                                size={30}
                            />
                        </Animatable.View>
                    )
                }}
            />
            <Tab.Screen
                name="FavouriteTab"
                component={Favouriteproducts}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Animatable.View
                            animation="zoomInUp"
                            duration={600}
                            style={{
                                backgroundColor: focused ? PRIMARYAPPCOLOR : WHITECOLOR,
                                height: 50,
                                width: 50,
                                borderRadius: 25,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <FontAwesome
                                name="heart"
                                color={focused ? LIGHTGREYNCOLOR : SECOUNDARYAPPCOLOR}
                                size={25}
                            />
                        </Animatable.View>
                    )
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigation;
