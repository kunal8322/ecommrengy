import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../utils/Icons';
import {  PRIMARYAPPCOLOR } from '../utils/Colour/Color';
import { HeaderComponetStyle } from '../Styles/CommonStyles';


const Header = ({
  label = '',
  onBack,
  iconName = 'chevron-back-outline',
  iconType = 'Ionicons',             
  iconSize = 25,
  iconColor = PRIMARYAPPCOLOR,
}) => {
  return (
    <View style={HeaderComponetStyle.container}>
      <TouchableOpacity onPress={onBack} style={HeaderComponetStyle.backButton}>
        <Icon
          type={iconType}
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      </TouchableOpacity>
      {label !== '' && <Text style={HeaderComponetStyle.label}>{label}</Text>}
    </View>
  );
};


export default Header;
