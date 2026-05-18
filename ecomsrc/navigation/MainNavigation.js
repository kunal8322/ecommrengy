import React, { Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BLACKCOLOR } from '../utils/Colour/Color';

import Splash from '../components/Splash';
import FormScreen from '../screens/Schedule/FormScreen';
import ScheduleScreen from '../screens/Schedule/ScheduleScreen';
import { navigationRef } from '../Helper/Helper';

const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
    <Suspense>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            gestureEnabled: false,
            headerShown: false,
          }}
        >
          {/* Animated Splash Screen */}
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{ statusBarHidden: true }}
          />

          {/* Form Screen (First Screen) */}
          <Stack.Screen
            name="FormScreen"
            component={FormScreen}
          />

          {/* Schedule Dynamic View Screen (Second Screen) */}
          <Stack.Screen
            name="ScheduleScreen"
            component={ScheduleScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Suspense>
  );
};

export default MainNavigation;
