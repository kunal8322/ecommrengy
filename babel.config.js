module.exports = {
  presets: ['module:@react-native/babel-preset'],
   plugins: ['react-native-reanimated/plugin'],
  // plugins: [
  //   ['module:react-native-dotenv', {
  //     moduleName: '@env',
  //     path: '.env',
  //     blacklist: null,
  //     whitelist: null,
  //     safe: false,
  //     allowUndefined: true
  //   }]
  // ],
};


// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'], // 👈 not @react-native
//   plugins: [
//     'react-native-reanimated/plugin', // 👈 keep LAST
//     // If you want to use dotenv later, add it BEFORE reanimated
//     // ['module:react-native-dotenv', {
//     //   moduleName: '@env',
//     //   path: '.env',
//     //   safe: false,
//     //   allowUndefined: true
//     // }]
//   ],
// };
