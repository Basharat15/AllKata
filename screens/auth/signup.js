import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../../component/theme";
import { TextInput } from "react-native";

import { getAuth, updateProfile } from "firebase/auth";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../libs/firebase";
import { setUser } from "../store/actions/user";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Signup = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;

  const [username, setUsername] = useState("");
  const [Loading, setLoading] = useState(false);
  const Data = route.params;

  const auth = getAuth();

  //   console.log(Data);

  const RegisterUser = async () => {
    setLoading(true);
    if (!username.length) {
      alert("Please Enter Username");
    } else {
      try {
        setLoading(true);
        await firebase
          .firestore()
          .collection("Users")
          .doc(auth.currentUser.uid)
          .set({
            userId: auth.currentUser.uid,
            username: username,
            phoneNumber: Data.phoneNumber,
            companies: [],
            workers: [],
            workingHours: [],
          });
        updateProfile(auth.currentUser, { displayName: username });
        // alert("Registered Successfully");
        await AsyncStorage.setItem("username", username);
        await AsyncStorage.setItem("userUniqueId", auth.currentUser.uid)
          .then(() => {
            console.log("username and id saved");
            dispatch(
              setUser({
                userId: auth.currentUser.uid,
                username: username,
                phoneNumber: Data.phoneNumber,
                companies: [],
                workers: [],
                workingHours: [],
              })
            );
          })
          .catch((error) => console.log("the error is", error));
        await navigation.replace("userIndex");
        setLoading(false);
      } catch (e) {
        console.log("the new eoe", e);
        alert(e.message);
      }
    }
    console.log(auth.currentUser);
    setLoading(false);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <LinearGradient
          // Background Linear Gradient
          colors={[theme.colors.updatedColor, theme.colors.updatedColor]}
          style={{ flex: 1 }}
        >
          <Image
            source={require("../../assets/appLogo1.png")}
            resizeMode="contain"
            style={{
              width: 150,
              height: 150,
              alignSelf: "center",
              // marginLeft: 15,
              tintColor: "white",
              marginTop: height / 10,
            }}
          />
          <Text
            style={{
              alignSelf: "center",
              fontFamily: "monsterBold",
              justifyContent: "center",
              textAlign: "center",
              marginTop: height / 20,
              color: "white",
              fontSize: 25,
              marginLeft: 15,
            }}
          >
            Welcome {"\n"}
            <Text
              style={{ fontFamily: "signature", fontSize: 30, color: "white" }}
            >
              Please Complete your Registeration
            </Text>
          </Text>
          <View style={{ width: "100%", height: height }}>
            <ScrollView style={{ flex: 1 }}>
              <View
                style={{
                  width: "100%",
                  // height: height,
                  // backgroundColor: "red",
                  marginTop: height / 20,
                  alignItems: "center",
                }}
              >
                <TextInput
                  onChangeText={(text) => setUsername(text)}
                  placeholder="Please Enter Your Name"
                  style={{
                    borderWidth: 1,
                    height: 50,
                    width: "90%",
                    borderRadius: 10,
                    borderColor: !username.length ? "red" : "green",
                    padding: 10,
                    fontFamily: "monsterRegular",
                  }}
                />
                <TextInput
                  editable={false}
                  placeholder={`${Data.phoneNumber}`}
                  style={{
                    marginTop: 10,
                    borderWidth: 1,
                    height: 50,
                    width: "90%",
                    borderRadius: 5,
                    padding: 10,
                    borderColor: "green",
                    fontFamily: "monsterRegular",
                  }}
                />
              </View>

              <TouchableOpacity style={styles.Submite} onPress={RegisterUser}>
                {Loading === true ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text
                    style={{
                      color: theme.colors.updatedColor,
                      fontSize: 16,
                      fontFamily: "monsterRegular",
                    }}
                  >
                    Register
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Submite: {
    marginTop: 10,
    width: "90%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: "white",
  },
});

export default Signup;
