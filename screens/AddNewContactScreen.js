import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  KeyboardAvoidingView,
  AsyncStorage,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
  Image
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import uuid from "uuid";
import * as firebase from "firebase";
import { Form, Item, Input, Label, Button } from "native-base";
import { RNCamera } from "react-native-camera";
import { Header } from "react-navigation";
export default class AddNewContactScreen extends React.Component {
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
      recording: false,
      processing: false,
      hasCameraPermission: null
    };
  }

  static navigationOptions = {
    title: "Contact App"
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  }
  saveContact = async () => {
    if (
      this.state.fname !== "" &&
      this.state.lname !== "" &&
      this.state.phone !== "" &&
      this.state.email !== "" &&
      this.state.address !== ""
    ) {
      this.setState({ isUploading: true });

      const dbReference = firebase.database().ref();
      console.log("dbReferendce>>>", dbReference);

      const storageRef = firebase.storage().ref();
      console.log("storageRef>>", storageRef);
      if (this.state.image !== "empty") {
        console.log("herer");
        const downloadUrl = await this.uploadImageAsync(
          this.state.image,
          storageRef
        );
        console.log("downloadUrl>>>", downloadUrl);
        this.setState({ imageDownloadUrl: downloadUrl });
      }

      let contact = {
        fname: this.state.fname,
        lname: this.state.lname,
        phone: this.state.phone,
        email: this.state.email,
        address: this.state.address,
        imageUrl: this.state.imageDownloadUrl
      };

      await dbReference.push(contact, error => {
        if (!error) return this.props.navigation.goBack();
      });

      //   await AsyncStorage.setItem(Date.now().toString(), JSON.stringify(contact))
      //     .then(() => {
      //       this.props.navigation.goBack();
      //     })
      //     .catch(error => console.log(error));
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
      console.log("image updated");
      this.setState({ image: result.uri });
    }
  };

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  };

  uploadImageAsync = async (uri, storageRef) => {
    console.log("isnside upload");
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
    console.log("ref>>", ref);
    const snapshot = await ref.put(blob);

    console.log("snapshot>>>", snapshot);
    blob.close();
    return await snapshot.ref.getDownloadURL();
  };

  async startRecording() {
    this.setState({ recording: true });
    // default to mp4 for android as codec is not set
    const { uri, codec = "mp4" } = await this.camera.recordAsync();
  }

  stopRecording() {
    this.camera.stopRecording();
  }
  render() {
    const { recording, processing } = this.state;
    let button = (
      <TouchableOpacity
        onPress={this.startRecording.bind(this)}
        style={styles.capture}
      >
        <Text style={{ fontSize: 14 }}> RECORD </Text>
      </TouchableOpacity>
    );

    if (recording) {
      button = (
        <TouchableOpacity
          // onPress={this.stopRecording.bind(this)}
          style={styles.capture}
        >
          <Text style={{ fontSize: 14 }}> STOP </Text>
        </TouchableOpacity>
      );
    }

    if (processing) {
      button = (
        <View style={styles.capture}>
          <ActivityIndicator animating size={18} />
        </View>
      );
    }
    if (this.state.isUploading) {
      return (
        <View
          style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#B83227" />
          <Text>Contact Uploading please wait..</Text>
        </View>
      );
    }
    return (
      <KeyboardAvoidingView
        //keyboardVerticalOffset={Header.HEIGHT + 20} // adjust the value here if you need more padding
        style={{ flex: 1 }}
        behavior="padding"
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <ScrollView style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                this.pickImage();
              }}
            >
              <Image
                source={
                  this.state.image === "empty"
                    ? require("../assets/person.png")
                    : {
                        uri: this.state.image
                      }
                }
                style={styles.imagePicker}
              />
            </TouchableOpacity>
            <View>
              {/* <RNCamera
                ref={ref => {
                  this.camera = ref;
                }}
                style={styles.preview}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                permissionDialogTitle={"Permission to use camera"}
                permissionDialogMessage={
                  "We need your permission to use your camera phone"
                }
              /> */}
              <RNCamera
                ref={ref => {
                  this.camera = ref;
                }}
                style={styles.preview}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                androidCameraPermissionOptions={{
                  title: "Permission to use camera",
                  message: "We need your permission to use your camera",
                  buttonPositive: "Ok",
                  buttonNegative: "Cancel"
                }}
                androidRecordAudioPermissionOptions={{
                  title: "Permission to use audio recording",
                  message: "We need your permission to use your audio",
                  buttonPositive: "Ok",
                  buttonNegative: "Cancel"
                }}
                onGoogleVisionBarcodesDetected={({ barcodes }) => {
                  console.log(barcodes);
                }}
              />
              <View
                style={{
                  flex: 0,
                  flexDirection: "row",
                  justifyContent: "center"
                }}
              >
                {button}
              </View>
            </View>

            <Form>
              <Item style={styles.inputItem}>
                <Label>First Name</Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={fname => this.setState({ fname })}
                />
              </Item>
              <Item style={styles.inputItem}>
                <Label>Last Name</Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={lname => this.setState({ lname })}
                />
              </Item>
              <Item style={styles.inputItem}>
                <Label>Phone</Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  onChangeText={phone => this.setState({ phone })}
                />
              </Item>
              <Item style={styles.inputItem}>
                <Label>Email</Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={email => this.setState({ email })}
                />
              </Item>
              <Item style={styles.inputItem}>
                <Label>Address </Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={address => this.setState({ address })}
                />
              </Item>
            </Form>
            <Button
              style={styles.button}
              full
              onPress={() => {
                this.saveContact();
              }}
            >
              <Text style={styles.buttonText}>Save</Text>
            </Button>
            {/* <View style={styles.empty}></View> */}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 10
  },
  imagePicker: {
    justifyContent: "center",
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 100,
    borderColor: "#c1c1c1",
    borderWidth: 2
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
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20
  }
});
