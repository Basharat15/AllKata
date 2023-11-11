import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import OTPTextInput from "react-native-otp-textinput";
import theme from "../../component/theme";
import { getFirestore, deleteDoc, doc } from "firebase/firestore";
import firebase from "../../libs/firebase";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier,
} from "firebase/auth";
import { getApp } from "firebase/app";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { useNavigation } from "@react-navigation/native";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setUser } from "../store/actions/user";

const Otp = ({ route }) => {
  // const [number, setNumber] = React.useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [token, setToken] = React.useState(null);
  const navigation = useNavigation();

  const [Tokentext, setTokenText] = React.useState("");

  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;
  const { data } = route.params;

  const { code, number } = data;
  // const temCode = Number("+92");

  const phoneNumber = code + number;
  // console.log(phoneNumber);

  const recaptchaVerifier = React.useRef(null);
  const auth = getAuth();
  const app = getApp();

  React.useEffect(() => {
    sendOtp();
  }, []);

  const sendOtp = async () => {
    const phoneProvider = new PhoneAuthProvider(auth);
    await phoneProvider
      .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
      .then((token) => {
        setToken(token);
        console.log("token send succesfully");
      })
      .catch((e) => {
        // navigation.goBack();
        alert(e.code);

        navigation.goBack();
        console.log(e);
      });
  };
  const getUserData = async (userId) => {
    try {
      await firebase
        .firestore()
        .collection("Users")
        .doc(userId)
        .get()
        .then((res) => {
          let data = res.data();

          dispatch(setUser(data));
        });
    } catch {
      (err) => {
        console.log("Error", err);
      };
    }
  };

  const VarifyOtp = async () => {
    if (Tokentext.length < 6) {
      alert("Otp in invalid");
      return;
    } else {
      setLoading(true);
      const credential = PhoneAuthProvider.credential(token, Tokentext);
      await signInWithCredential(auth, credential)
        .then(async (userCridintial) => {
          console.log(userCridintial.user.displayName);
          if (userCridintial.user.displayName != null) {
            await AsyncStorage.setItem(
              "username",
              userCridintial.user.displayName
            )

              .then(() => {
                console.log("username saved on page otp");
                getUserData(userCridintial.user.uid);
              })
              .catch((error) =>
                console.log("the error is on otp secure store", error)
              );
            await AsyncStorage.setItem(
              "userUniqueId",
              userCridintial.user.uid
            ).then((res) => console.log("user full data saved"));
            navigation.navigate("userIndex");
            setLoading(false);
          } else {
            setLoading(true);
            navigation.navigate("signup", {
              phoneNumber: userCridintial.user.providerData[0].phoneNumber,
              userId: auth.currentUser.uid,
            });
            setLoading(false);
          }
          console.log(userCridintial.user.displayName);
          // navigation.navigate("profile", fullNumber);
        })
        .catch((e) => {
          alert("Invalid OTP");
          setLoading(false);
        });
    }
  };

  const otpInput = useRef(null);

  const setText = () => {
    otpInput.current.setValue("1234");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <LinearGradient
          // Background Linear Gradient
          colors={[theme.colors.updatedColor, theme.colors.updatedColor]}
          style={{
            height: Dimensions.get("screen").height / 1.1,
            width: "100%",
          }}
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
          <View style={{ width: "90%", alignSelf: "center" }}>
            <Text
              style={{
                marginTop: "15%",
                fontFamily: "monsterBold",
                fontSize: 18,
                alignSelf: "center",
                color: "white",
              }}
            >
              Varify your phone number
            </Text>
            <Text
              style={{
                marginTop: "5%",
                fontFamily: "monsterRegular",
                fontSize: 16,
                alignSelf: "center",
                color: "white",
              }}
            >
              Enter the code we've sent by text to {"\n"}{" "}
              {data.code ? data.code : "+92"} {data.number}
              <Text
                onPress={() => navigation.goBack()}
                style={{
                  textDecorationLine: "underline",
                  color: "blue",
                  fontSize: 13,
                }}
              >
                Change
              </Text>
            </Text>
            <OTPTextInput
              keyboardType="numeric"
              textInputStyle={{
                marginTop: 20,
                borderRadius: 10,
                borderWidth: 0.5,
              }}
              ref={otpInput}
              inputCount={6}
              tintColor={"white"}
              handleTextChange={(text) => setTokenText(text)}
            />
          </View>
          <TouchableOpacity onPress={VarifyOtp} style={styles.Submite}>
            {loading == true ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text
                style={{
                  color: theme.colors.updatedColor,
                  fontSize: 16,
                  fontFamily: "monsterRegular",
                }}
              >
                Varify
              </Text>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>

      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
        // attemptInvisibleVerification
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  Submite: {
    position: "absolute",
    bottom: Dimensions.get("screen").height / 25,
    width: "90%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: "white",
  },
});
export default Otp;
