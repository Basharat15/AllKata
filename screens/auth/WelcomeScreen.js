import {
  View,
  Text,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../../component/theme";

const WelcomeScreen = ({ navigation }) => {
  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="rgba(0,0,0,0.8)" />
      <LinearGradient
        // Background Linear Gradient
        colors={[theme.colors.updatedColor, theme.colors.updatedColor]}
        style={{ flex: 1 }}
      >
        <Image
          source={require("../../assets/appLogo1.png")}
          resizeMode="contain"
          style={{
            width: 200,
            height: 150,
            alignSelf: "center",
            // tintColor: "#020C32",
            marginTop: height / 5,
          }}
        />
        <Text
          style={{
            textAlign: "center",
            marginTop: 40,
            color: "#ffffff",
            fontSize: 16,
            fontFamily: "monsterRegular",
          }}
        >
          Welcome to Time vault,Your own Vault {"\n"} All records in one place
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("login")}
          style={{
            position: "absolute",
            bottom: height / 25,
            width: "90%",
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            borderRadius: 10,
            backgroundColor: '#ffffff',
          }}
        >
          <Text
            style={{
              color: theme.colors.updatedColor,
              fontSize: 16,
              fontFamily: "monsterRegular",
            }}
          >
            Explore
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default WelcomeScreen;
