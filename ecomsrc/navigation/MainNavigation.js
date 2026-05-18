import React, { Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BLACKCOLOR } from '../utils/Colour/Color';

import Home from '../screens/Home/Home';
import ProductInfo from '../screens/Product/ProductInfo';
import Toast from 'react-native-toast-message';
import Cart from '../screens/Cart/Cart';

import Splash from '../components/Splash';
import TabNavigation from './TabNavigation';
import Favouriteproducts from '../screens/Product/Favouriteproducts';
import { navigationRef } from '../Helper/Helper';

const Stack = createStackNavigator();
const MainNavigation = () => {
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Suspense>
          <Stack.Navigator
            screenOptions={({ route }) => ({
              gestureEnabled: false,
              headerStyle: {
                backgroundColor: BLACKCOLOR,
              },
              headerTintColor: '#fff',
              headerTitleAlign: 'center'
            })}
          >
            <Stack.Screen
              name="Splash"
              component={Splash}
              options={{ headerShown: false, statusBarHidden: true }}
            />

            <Stack.Screen
              name="TabNavigation"
              component={TabNavigation}
              options={{
                headerShown: false,
                gestureEnabled: false
              }}
            />

            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="ProductInfo"
              component={ProductInfo}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Cart"
              component={Cart}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Favouriteproducts"
              component={Favouriteproducts}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </Suspense>
      </NavigationContainer>
      <Toast position='bottom' bottomOffset={100} />
    </>
  );
};

export default MainNavigation;
