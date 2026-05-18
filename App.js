import { View, Text, TextInput } from 'react-native';
import React from 'react';
import 'react-native-gesture-handler';
import MainNavigation from './ecomsrc/navigation/MainNavigation';

// Disable font scaling globally across the entire app
// to satisfy the strict font sizing requirements
if (Text.defaultProps) {
  Text.defaultProps.allowFontScaling = false;
} else {
  Text.defaultProps = { allowFontScaling: false };
}

if (TextInput.defaultProps) {
  TextInput.defaultProps.allowFontScaling = false;
} else {
  TextInput.defaultProps = { allowFontScaling: false };
}

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <MainNavigation />
    </View>
  );
};

export default App;
