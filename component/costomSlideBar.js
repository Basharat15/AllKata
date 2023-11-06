import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
// import Slider from "react-native-slide-to-unlock";

import Logout from "react-native-vector-icons/MaterialIcons";
import { getAuth, signOut } from "firebase/auth";
import theme from "./theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

function CustomSidebarMenu(props) {
  const auth = getAuth();
  const [email, setEmail] = React.useState("");
  const navigation = useNavigation();

  const width = useWindowDimensions().width * 0.3;

  React.useEffect(() => {
    AsyncStorage.getItem("username")
      .then((res) => {
        console.log("the user email is ", res);
        setEmail(res);
      })
      .catch((e) => {});
  }, []);

  const logOutUser = () => {
    signOut(auth)
      .then(async (res) => {
        await AsyncStorage.clear()
          .then(() => {
            navigation.replace("boot");
          })
          .catch((err) => {
            alert(err);
          });
      })
      .catch((e) => {
        alert(e);
      });
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={{
        flexDirection: "column",
        flex: 1,
        marginTop: -5,
        backgroundColor: "lightgray",
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.updatedColor,
          height: 180,
          justifyContent: "center",
          //   borderRadius: 150,
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            marginLeft: "3%",
            borderRadius: 300,
            justifyContent: "center",
            alignSelf: "flex-start",
            backgroundColor: "gray",
          }}
        >
          <Image
            resizeMode="contain"
            source={require("../assets/appLogo1.png")}
            style={{
              width: 70,
              height: 70,
              alignSelf: "center",
              tintColor: "white",
            }}
          />
        </View>

        {/* ...................TextView................... */}
        <Text
          style={{
            marginLeft: 10,
            marginTop: 10,
            color: "white",
            fontFamily: "monsterBold",
            fontSize: 13,
          }}
        >
          Welcome {email}
        </Text>
        <Text
          style={{
            color: "white",
            fontFamily: "monsterRegular",
            fontSize: 12,
            marginLeft: 10,
          }}
        >
          You are logged in as {email}
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          height: 50,
          alignItems: "center",
          borderBottomWidth: 0.5,
          borderBottomColor: "gray",
          flexDirection: "row",
        }}
      >
        <Logout
          name="logout"
          size={25}
          style={{ marginLeft: 10 }}
          color={theme.colors.updatedColor}
        />
        <Text
          style={{
            marginLeft: 5,
            fontFamily: "monsterRegular",
            color: theme.colors.updatedColor,
          }}
          onPress={logOutUser}
        >
          Logout
        </Text>
      </View>
    </DrawerContentScrollView>
  );
}
export default CustomSidebarMenu;
