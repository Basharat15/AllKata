import React from "react";
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import HeaderView from "../../component/headerView";
import theme from "../../component/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import firebase from "../../libs/firebase";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const user = useSelector((state) => state.userReducer.user);
  const navigation = useNavigation();
  const auth = getAuth();
  const handleDeleteProfile = () => {
    Alert.alert("Alert", "Are you sure you want to delete your profile?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "confirm", onPress: () => deleleProfile() },
    ]);
  };
  const deleleProfile = async () => {
    const profile = firebase.auth().currentUser;
    profile
      .delete()
      .then(async () => {
        await firebase
          .firestore()
          .collection("Users")
          .doc(user.userId)
          .delete()
          .then(async () => {
            await AsyncStorage.clear();
            navigation.replace("boot");
            alert("Your profile has been deleted successfully!");
          })
          .catch((err) => {
            alert("Error", err.message);
          });
      })
      .catch((err) => {
        alert("Error", err.message);
      });
  };
  return (
    <View style={styles.container}>
      <StatusBar animated={true} backgroundColor={theme.colors.updatedColor} />
      <HeaderView pageName="Profile" />
      <View style={styles.infoContainer}>
        <View
          style={{
            height: 75,
            width: 75,
            backgroundColor: "white",
            borderRadius: 50,
            overflow: "hidden",
            padding: 7,
          }}
        >
          <Image
            source={require("../../assets/icons/profile.png")}
            style={{
              height: "100%",
              width: "100%",
              tintColor: theme.colors.updatedColor,
            }}
          />
        </View>
        <Text style={styles.userName}>{user?.username}</Text>
        <Text style={styles.phoneNumber}>{user?.phoneNumber}</Text>
        <LinearGradient
          // Background Linear Gradient
          colors={[theme.colors.updatedColor, theme.colors.updatedColor]}
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,

            width: "90%",
            height: 50,
            borderRadius: 10,
            marginTop: 50,
          }}
        >
          <TouchableOpacity
            onPress={handleDeleteProfile}
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              height: 50,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "monsterBold",
                fontSize: 15,
                color: "white",
              }}
            >
              Delete Profile
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

// Responsive design using Dimensions
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: theme.colors.backgroundColor,
  },
  infoContainer: {
    marginTop: 150,
    alignItems: "center",
    flex: 1,
  },
  userName: {
    fontSize: width * 0.08,
    fontFamily: "monsterBold",
    color: "#333",
    marginTop: 15,
  },
  phoneNumber: {
    fontSize: width * 0.05,
    marginTop: 5,
    color: "#666",
    fontFamily: "monsterRegular",
  },
});

export default Profile;
