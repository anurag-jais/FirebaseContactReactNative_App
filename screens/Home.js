import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
  Image
} from "react-native";
import { Card } from "native-base";
import { EnTypo } from "@expo/vector-icons";
import * as firebase from "firebase";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      isListEmpty: false
    };
  }
  static navigationOptions = {
    title: "Contact App"
  };

  componentWillMount() {
    this.getAllContacts();
    // const { navigation } = this.props;
    // navigation.addListener("willFocus", () => {
    //   this.getAllContacts();
    // });
  }

  getAllContacts = async () => {
    let self = this;
    let contactRef = firebase.database().ref();

    contactRef.on("value", dataSnapshot => {
      if (dataSnapshot.val()) {
        let contactResult = Object.values(dataSnapshot.val());
        let contactKey = Object.keys(dataSnapshot.val());
        contactKey.forEach((value, key) => {
          contactResult[key]["key"] = value;
        });
        self.setState({
          data: contactResult.sort((a, b) => {
            var nameA = a.fname.toUpperCase();
            var nameB = b.fname.toUpperCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          }),
          isListEmpty: false
        });
      } else {
        self.setState({
          isListEmpty: true
        });
      }
      self.setState({ isLoading: false });
    });
    // await AsyncStorage.getAllKeys()
    //   .then(keys => {
    //     console.log("keys>>>", keys);
    //     return AsyncStorage.multiGet(keys)
    //       .then(result => {
    //         console.log("result>>", result);
    //         this.setState({
    //           data: result.sort(function(a, b) {
    //             if (JSON.parse(a[1]).fname < JSON.parse(b[1]).fname) return -1;
    //             if (JSON.parse(a[1]).fname > JSON.parse(b[1]).fname) return 1;
    //             return 0;
    //           })
    //         });
    //       })
    //       .catch(error => {
    //         console.log("error in multiGet", error);
    //       });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // console.log(this.state.data);
  };
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => {
            //contact = JSON.parse(item[1]);
            return (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("View", {
                    // key: item[0].toString()
                    key: item.key
                  });
                }}
              >
                <Card style={styles.listItem}>
                  <View>
                    <Image
                      style={styles.contactIcon}
                      source={
                        item.imageUrl === "empty"
                          ? require("../assets/person.png")
                          : { uri: item.imageUrl }
                      }
                    />
                  </View>
                  {/* <View style={styles.iconContainer}>
                    <Text style={styles.contactIcon}>
                      {contact.fname[0].toUpperCase()}
                    </Text>
                  </View> */}
                  <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                      {/* {contact.fname} {contact.lname} */}
                      {item.fname} {item.lname}
                    </Text>
                    <Text style={styles.infoText}>{item.phone}</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          }}
          //   keyExtractor={(item, index) => item[0].toString()}
        />
        <TouchableOpacity
          style={styles.floatButton}
          onPress={() => {
            this.props.navigation.navigate("Add");
          }}
        >
          <Text>HomeScreen</Text>
          {/* <Text>
            <EnTypo name="plus" size={30} color="white" />
          </Text> */}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  listItem: {
    flexDirection: "row",
    padding: 20
  },
  iconContainer: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B83227",
    borderRadius: 100
  },
  contactIcon: {
    width: 60,
    height: 60,
    borderRadius: 100
    // fontSize: 28,
    // color: "#fff"
  },
  infoContainer: {
    flexDirection: "column"
  },
  infoText: {
    fontSize: 16,
    fontWeight: "400",
    paddingLeft: 10,
    paddingTop: 2
  },
  floatButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    position: "absolute",
    bottom: 10,
    right: 10,
    height: 60,
    backgroundColor: "#B83227",
    borderRadius: 100
  }
});
