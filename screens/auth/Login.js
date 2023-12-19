import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../../component/theme";

import { CountryPicker } from "react-native-country-codes-picker";
import { Button } from "react-native";
import { Platform } from "react-native";
import { StatusBar } from "react-native";

import Icone from "react-native-vector-icons/MaterialIcons";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const navigation = useNavigation();
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState(null);
  const [countryName, setCountryName] = React.useState("");
  const [number, setNumber] = React.useState("");

  const [error, setError] = React.useState("");
  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;

  const submiteNumber = () => {
    if (!number) {
      setError("please enter your phone number");
    } else if (!countryCode) {
      setError("please select country");
    } else if (number.length < 7) {
      setError("please enter valid number");
    } else {
      navigation.navigate("otp", {
        data: {
          number: number,
          code: countryCode,
        },
      });
    }
  };

  // navigation.navigate("otp", {
  //   data: {
  //     number: number,
  //     code: countryCode,
  //   },
  //  } }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.updatedColor,
      }}
    >
      <ScrollView>
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
              // tintColor: "#020C32",
              marginTop: height / 10,
            }}
          />
          <Text
            style={{
              alignSelf: "center",
              fontFamily: "monsterBold",
              marginTop: height / 20,
              color: "#ffffff",
              fontSize: 25,
              marginLeft: 15,
            }}
          >
            Now Everything {"\n"}
            <Text style={{ fontFamily: "signature", fontSize: 40 }}>
              In Your Hand
            </Text>
          </Text>

          <View style={{ width: "100%", height: 230 }}>
            <CountryPicker
              onBackdropPress={() => setShow(false)}
              show={show}
              style={{ modal: { height: height / 2 } }}
              inputPlaceholder=" Search Country Name"
              // when picker button press you will get the country object with dial code
              pickerButtonOnPress={(item) => {
                setCountryCode(item.dial_code);
                setCountryName(item.name.en);
                // console.log(item.name);
                setShow(false);
              }}
            />
            {/* select country button */}
            <TouchableOpacity
              style={styles.selectCountry}
              onPress={() => setShow(true)}
            >
              <Text
                style={{
                  marginLeft: 10,
                  fontFamily: "monsterRegular",
                  color: "white",
                }}
              >
                {countryName ? countryName : "Select Country"}
              </Text>
              <Icone name="arrow-drop-down" size={20} color="white" />
            </TouchableOpacity>
            {/* ....number input touchable */}
            <View
              style={{
                width: "90%",
                height: 50,
                marginTop: 10,
                flexDirection: "row",
                // justifyCon
                alignSelf: "center",
              }}
            >
              {/* ....phone code View// */}
              <View
                style={{
                  flexDirection: "row",
                  height: 50,
                  width: "20%",
                  borderWidth: 0.5,
                  justifyContent: "center",
                  borderRadius: 10,
                  borderColor: "white",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "monsterRegular",
                    color: "white",
                  }}
                >
                  {countryCode ? countryCode : "--"}
                </Text>
                <Icone name="arrow-drop-down" size={20} color="white" />
              </View>
              {/* number input View.///// */}
              <View style={styles.textInput}>
                <TextInput
                  onChangeText={(text) => {
                    setError("");
                    setNumber(text);
                  }}
                  keyboardType="numeric"
                  placeholder="Enter Phone Number"
                  placeholderTextColor={"white"}
                  style={{
                    fontFamily: "monsterRegular",
                    marginLeft: 10,
                    color: "white",
                  }}
                />
              </View>
            </View>

            <Text
              style={{
                marginLeft: "5%",
                fontStyle: "italic",
                color: "red",
                marginTop: 5,
              }}
            >
              {error}
            </Text>
          </View>
          <TouchableOpacity
            onPress={submiteNumber}
            style={{
              width: "90%",
              alignSelf: "center",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              height: 50,
              backgroundColor: "#7CB342",
            }}
          >
            <Text
              style={{
                fontFamily: "monsterRegular",
                fontSize: 16,
                color: "white",
              }}
            >
              Submite
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  selectCountry: {
    flexDirection: "row",

    width: "90%",
    height: 50,
    marginTop: Dimensions.get("screen").height / 10,
    alignSelf: "center",
    borderRadius: 10,
    padding: 10,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#ffffff",
  },
  textInput: {
    width: "78%",
    marginLeft: 10,
    height: 50,
    borderWidth: 0.5,
    borderColor: "white",
    borderRadius: 10,
    justifyContent: "center",
  },
});

export default Login;
