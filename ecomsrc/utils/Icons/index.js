import React from 'react';
import Zocial from 'react-native-vector-icons/Zocial';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';


const getIconFont = (type) => {
  switch (type) {
    case 'fontisto':
      return Fontisto;
    case 'MaterialIcons':
      return MaterialIcons;
    case 'evil':
      return EvilIcons;
    case 'feather':
      return Feather;
    case 'ant':
      return AntDesign;
    case 'simpleLine':
      return SimpleLineIcons;
    case 'zocial':
      return Zocial;
    case 'simpleLine':
      return SimpleLineIcons;
    case 'foundation':
      return Foundation;
    case 'FontAwesome':
      return FontAwesome;
    case 'FontAwesome5':
      return FontAwesome5;
    case 'Ionicons':
      return Ionicons;
    case 'materialCommunity':
      return MaterialCommunityIcons;
    case 'Entypo':
      return Entypo;
    case 'octicon':
      return Octicons;
      case 'FontAwesome6':
        return FontAwesome6;
    default:
      return FontAwesome5;
  }
};

const Icon = ({type, ...props}) => {
  const FontICon = getIconFont(type);

  return <FontICon {...props} />;
};

export default Icon;