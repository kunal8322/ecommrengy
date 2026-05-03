import React, { useContext, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { PRIMARYAPPCOLOR } from '../utils/Colour/Color';
import { useNavigation } from '@react-navigation/native';
import { DataContext } from '../Context/DataProvider';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const navigation = useNavigation();
  
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('TabNavigation');
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/applogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARYAPPCOLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
  },
});
