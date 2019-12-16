import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
  AsyncStorage,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions
} from "react-native";
import { Card, CardItem } from "native-base";
import { EnTypo } from "@expo/vector-icons";
import * as firebase from "firebase";

export default class ViewContactScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: null,
      lname: null,
      phone: null,
      email: null,
      address: null,
      imageUrl: null,
      key: null,
      isLoading: true
    };
  }

  static navigationOptions = {
    title: "View Contact"
  };

  componentDidMount() {
    const { navigation } = this.props;

    navigation.addListener("willFocus", () => {
      var key = this.props.navigation.getParam("key", "");
      //TODO call a method to use key
      this.getContact(key);
    });
  }

  getContact = async key => {
    let self = this;
    let contactRef = firebase
      .database()
      .ref()
      .child(key);

    await contactRef.on("value", dataSnapshot => {
      if (dataSnapshot.val()) {
        contactValue = dataSnapshot.val();
        self.setState({
          fname: contactValue.fname,
          lname: contactValue.lname,
          phone: contactValue.phone,
          email: contactValue.email,
          address: contactValue.address,
          imageUrl: contactValue.imageUrl,
          key: key,
          isLoading: false
        });
      }
    });
    // await AsyncStorage.getItem(key)
    //   .then(contactjsonString => {
    //     console.log("contactjsonString>>>>>>>>>");
    //     console.log(contactjsonString);
    //     var contact = JSON.parse(contactjsonString);
    //     contact["key"] = key;
    //     this.setState(contact);
    //   })
    //   .catch(error => console.log(error));
  };

  callAction = phone => {
    let phoneNumber = phone;
    if (Platform.OS !== "android") {
      phoneNumber = `telpromt:${phone}`;
    } else {
      phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert("Phone number is not available");
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(error => console.log(error));
  };

  smsAction = phone => {
    let phoneNumber = phone;
    phoneNumber = `sms:${phone}`;
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert("Phone Number is not avaiable");
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(error => console.log(error));
  };

  editContact = key => {
    this.props.navigation.navigate("Edit", {
      key: key
    });
  };

  deleteContact = key => {
    Alert.alert(
      "Delete Contact ? ",
      `${this.state.fname} ${this.state.lname}`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("cancel tapped")
        },
        {
          text: "OK",
          onPress: async () => {
            let contactRef = firebase
              .database()
              .ref()
              .child(key);
            await contactRef.remove(error => {
              if (!error) {
                this.props.navigation.navigate.goBack();
              }
            });
            // await AsyncStorage.removeItem(key)
            //   .then(() => {
            //     this.props.navigation.goBack();
            //   })
            //   .catch(error => console.log(error));
          }
        }
      ],
      { cancelable: false }
    );
  };
  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            alignContent: "center",
            justifyContent: "center"
          }}
        >
          <ActivityIndicator size="large" color="#B83227" />
          <Text style={{ textAlign: "center" }}>
            Contact loading please wait..
          </Text>
        </View>
      );
    }
    return (
      <ScrollView style={styles.container}>
        <View style={styles.contactIconContainer}>
          <Image
            style={styles.contactIcon}
            source={
              this.state.imageUrl === "empty"
                ? require("../assets/person.png")
                : {
                    uri: this.state.imageUrl
                  }
            }
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {this.state.fname} {this.state.lname}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Card>
            <CardItem bordered>
              <Text style={styles.infoText}>Phone</Text>
            </CardItem>
            <CardItem bordered>
              <Text style={styles.infoText}>{this.state.phone}</Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem bordered>
              <Text style={styles.infoText}>Email</Text>
            </CardItem>
            <CardItem bordered>
              <Text style={styles.infoText}>{this.state.email}</Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem bordered>
              <Text style={styles.infoText}>Address</Text>
            </CardItem>
            <CardItem bordered>
              <Text style={styles.infoText}>{this.state.address}</Text>
            </CardItem>
          </Card>
        </View>
        <Card style={styles.actionContainer}>
          <CardItem style={styles.actionButton} bordered>
            <TouchableOpacity
              onPress={() => {
                this.smsAction(this.state.phone);
              }}
            >
              <Text>Message</Text>
              {/* <EnTypo name="message" size={50} color="#B83227" /> */}
            </TouchableOpacity>
          </CardItem>
          <CardItem style={styles.actionButton} bordered>
            <TouchableOpacity
              onPress={() => {
                this.callAction(this.state.phone);
              }}
            >
              <Text>CAll</Text>
              {/* <EnTypo name="message" size={50} color="#B83227" /> */}
            </TouchableOpacity>
          </CardItem>
        </Card>
        <Card style={styles.actionContainer}>
          <CardItem style={styles.actionButton} bordered>
            <TouchableOpacity
              onPress={() => {
                this.editContact(this.state.key);
              }}
            >
              <Text>EditIcon</Text>
              {/* <EnTypo name="message" size={50} color="#B83227" /> */}
            </TouchableOpacity>
          </CardItem>
          <CardItem style={styles.actionButton} bordered>
            <TouchableOpacity
              onPress={() => {
                this.deleteContact(this.state.key);
              }}
            >
              <Text>DeleteIcon</Text>
              {/* <EnTypo name="message" size={50} color="#B83227" /> */}
            </TouchableOpacity>
          </CardItem>
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contactIconContainer: {
    height: 200,
    backgroundColor: "#B83227",
    alignItems: "center",
    justifyContent: "center"
  },
  contactIcon: {
    height: Dimensions.get("window").width,
    width: Dimensions.get("window").width

    // fontSize: 100,
    // fontWeight: "bold",
    // color: "#fff"
  },
  nameContainer: {
    width: "100%",
    height: 70,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    position: "absolute",
    bottom: 0
  },
  name: {
    fontSize: 24,
    color: "#000",
    fontWeight: "900"
  },
  infoContainer: {
    flexDirection: "column"
  },
  infoText: {
    fontSize: 18,
    fontWeight: "300"
  },
  actionContainer: {
    flexDirection: "row"
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  actionText: {
    color: "#B83227",
    fontWeight: "900"
  }
});
