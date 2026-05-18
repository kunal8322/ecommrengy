import {View} from 'react-native';
import React from 'react';
import 'react-native-gesture-handler';
import MainNavigation from './ecomsrc/navigation/MainNavigation';
import DataProvider from './ecomsrc/Context/DataProvider';

const App = () => {
  return (
    <DataProvider>
        <View style={{flex: 1}}>
          <MainNavigation />
        </View>
    </DataProvider>
  );
};

export default App;
