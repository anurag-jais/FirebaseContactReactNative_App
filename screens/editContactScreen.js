import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  AsyncStorage,
  Alert
} from "react-native";
import { Form, Item, Input, Label, Button } from "native-base";
import uuid from "uuid";
import * as firebase from "firebase";
import * as ImagePicker from "expo-image-picker";

export default class EditContactScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      phone: "",
      email: "",
      address: "",
      image: "empty",
      imageDownloadUrl: "empty",
      isUploading: false,
      isLoading: true,
      key: ""
    };
  }
  static navigationOptions = {
    title: "Contact App"
  };

  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener("willFocus", () => {
      var key = this.props.navigation.getParam("key", "");
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
        caontactValue = dataSnapshot.val();
        self.setState({
          fname: contactValue.fname,
          lname: contactValue.lname,
          phone: contactValue.phone,
          email: contactValue.email,
          address: contactValue.address,
          imageUrl: contactValue.imageUrl
        });
      }
    });
    // await AsyncStorage.getItem(key)
    //   .then(contactjsonString => {
    //     var contact = JSON.parse(contactjsonString);
    //     contact["key"] = key;
    //     this.setState(contact);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  };

  updateContact = async key => {
    if (
      this.state.fname !== "" &&
      this.state.lname !== "" &&
      this.state.phone !== "" &&
      this.state.email !== "" &&
      this.state.address !== ""
    ) {
      this.setState({
        isUploading: true
      });
      const dbReference = firebase.database().ref();
      const storageRef = firebase.storage().ref();

      if (this.state.image !== "empty") {
        const downloadUrl = await this.uploadImageAsync(
          this.state.image,
          storageRef
        );
        this.setState({
          imageDownloadUrl: downloadUrl
        });
        var contact = {
          fname: this.state.fname,
          lname: this.state.lname,
          phone: this.state.phone,
          email: this.state.email,
          address: this.state.address,
          imageUrl: this.state.imageUrl
        };
        await dbReference.child(key).set(contact, error => {
          if (!error) {
            return this.props.navigation.goBack();
          }
        });
      }
      //   var contact = {
      //     fname: this.state.fname,
      //     lname: this.state.lname,
      //     phone: this.state.phone,
      //     email: this.state.email,
      //     address: this.state.address
      //   };
      //   await AsyncStorage.mergeItem(key, JSON.stringify(contact))
      //     .then(() => {
      //       this.props.navigation.goBack();
      //     })
      //     .catch(error => console.log(error));
    } else {
    }
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.2,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1]
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  uploadImageAsync = async (uri, storageRef) => {
    const parts = uri.split(".");
    const fileExtension = parts[parts.length - 1];

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    const ref = storageRef
      .child("ContactImages")
      .child(uuid.v4() + "." + fileExtension);
    const snapshot = await ref.put(blob);

    blob.close();
    return await snapshot.ref.getDownloadURL();
  };
  render() {
    console.log("state");
    console.log(this.state);
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <Form>
            <Item style={styles.inputItem}>
              <Label>First Name</Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                KeyboardType="default"
                onChangeText={fname => this.setState({ fname })}
                value={this.state.fname}
              />
            </Item>

            <Item style={styles.inputItem}>
              <Label>Last Name</Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                KeyboardType="default"
                onChangeText={lname => this.setState({ lname })}
                value={this.state.lname}
              />
            </Item>

            <Item style={styles.inputItem}>
              <Label>Phone</Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                KeyboardType="decimal-pad"
                onChangeText={phone => this.setState({ phone })}
                value={this.state.phone}
              />
            </Item>

            <Item style={styles.inputItem}>
              <Label>Email</Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                KeyboardType="default"
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
              />
            </Item>

            <Item style={styles.inputItem}>
              <Label>Address</Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                KeyboardType="default"
                onChangeText={address => this.setState({ address })}
                value={this.state.address}
              />
            </Item>
          </Form>
          <Button
            full
            rounded
            style={styles.button}
            onPress={() => {
              this.updateContact(this.state.key);
            }}
          >
            <Text style={styles.buttonText}>Update</Text>
          </Button>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 10
  },
  inputItem: {
    margin: 10
  },
  button: {
    backgroundColor: "#B83227",
    marginTop: 40
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});
