import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Home from "./screens/Home";
import AddNewContactScreen from "./screens/AddNewContactScreen";
import EditContactScreen from "./screens/editContactScreen";
import ViewContactScreen from "./screens/viewContactScreen";
import { NativeModulesProxy } from "@unimodules/core";

import * as firebase from "firebase";
const MainNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    Add: { screen: AddNewContactScreen },
    View: { screen: ViewContactScreen },
    Edit: { screen: EditContactScreen }
  },
  {
    defaultNavigationOptions: {
      headerTintColor: "#fff",
      headerStyle: {
        backgroundColor: "#b83227"
      },
      headerTitleStyle: {
        color: "#fff"
      }
    }
  }
);

const App = createAppContainer(MainNavigator);

const firebaseConfig = {
  apiKey: "AIzaSyAC917sLPtfWzti2BRRq4LuREXU3u2o9rU",
  authDomain: "reactbootcamp-43177.firebaseapp.com",
  databaseURL: "https://reactbootcamp-43177.firebaseio.com",
  projectId: "reactbootcamp-43177",
  storageBucket: "reactbootcamp-43177.appspot.com",
  messagingSenderId: "625520176089",
  appId: "1:625520176089:web:7f99dfa2e41d4b7afd47c8",
  measurementId: "G-Y3111MXP21"
};

firebase.initializeApp(firebaseConfig);

export default App;
// module.exports = App;

// export default class App extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text>Open up App.js to start working on your app!</Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center"
//   }
// });

// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
