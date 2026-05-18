import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, Platform } from 'react-native';
import { PRIMARYAPPCOLOR, WHITECOLOR } from '../utils/Colour/Color';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('FormScreen');
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARYAPPCOLOR} />
      
      {/* Animated Calendar/Time Logo Icon */}
      <Animatable.View
        animation="bounceIn"
        duration={1500}
        style={styles.logoContainer}
      >
        <Ionicons name="calendar" size={width * 0.28} color={WHITECOLOR} />
      </Animatable.View>

      {/* App Title */}
      <Animatable.Text
        animation="fadeInUp"
        duration={1200}
        delay={400}
        style={styles.title}
      >
        ScheduleMaster
      </Animatable.Text>

      {/* App Subtitle */}
      <Animatable.Text
        animation="fadeInUp"
        duration={1200}
        delay={800}
        style={styles.subtitle}
      >
        Your Custom Work Schedule Planner
      </Animatable.Text>

      {/* Subtle loader dot animation */}
      <View style={styles.loaderContainer}>
        <Animatable.View
          animation="flash"
          iterationCount="infinite"
          duration={1500}
          style={styles.loaderDot}
        />
      </View>
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
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    padding: 24,
    borderRadius: 40,
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: WHITECOLOR,
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    fontWeight: '500',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 50,
  },
  loaderDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: WHITECOLOR,
  },
});
