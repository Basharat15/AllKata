import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../component/theme";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "../libs/firebase";
import { useDispatch } from "react-redux";
import { setUser } from "./store/actions/user";

const Boot = ({ route }) => {
  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  React.useEffect(() => {
    setTimeout(() => {
      getUserData();
    }, 3000);
  });

  const getUserData = async () => {
    let result = await AsyncStorage.getItem("userUniqueId");
    if (result != null) {
      await firebase
        .firestore()
        .collection("Users")
        .doc(result)
        .get()
        .then((res) => {
          let data = res.data();
          dispatch(setUser(data));
        });
      navigation.replace("userIndex");
    } else {
      navigation.replace("AuthIndex");
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#42A3A6", "#42A3A6"]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Image
          source={require("../assets/appLogo1.png")}
          resizeMode="contain"
          style={{
            width: 200,
            height: 200,
            alignSelf: "center",
            // marginLeft: 15,
          }}
        />
        <Text
          style={{
            textAlign: "center",
            marginTop: 30,
            color: "#ffffff",
            fontSize: 16,
            fontFamily: "monsterRegular",
          }}
        >
          Welcome to Time Vault,Your own Vault {"\n"} All records in one place.
        </Text>
        <View style={{ position: "absolute", bottom: 10 }}>
          <Text
            style={{
              fontFamily: "signature",
              fontSize: 20,
              color: "#ffffff",
              // marginTop: height / 2,
            }}
          >
            loading your kata
          </Text>
          <ActivityIndicator size={30} style={{ marginTop: 10 }} />
        </View>
        <View style={{ width: "90%", alignSelf: "center" }}></View>
      </LinearGradient>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({});
export default Boot;
