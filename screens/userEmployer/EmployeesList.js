import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  StatusBar,
  Alert,
  Modal,
  TouchableOpacity,
  Button,
  Dimensions,
  Image,
} from "react-native";
import HeaderView from "../../component/headerView";
import theme from "../../component/theme";
import Add from "react-native-vector-icons/Ionicons";
import User from "react-native-vector-icons/AntDesign";
import Arrow from "react-native-vector-icons/MaterialIcons";
import Compeny from "react-native-vector-icons/MaterialCommunityIcons";
import firebase from "../../libs/firebase";
import {
  useNavigation,
  useRoute,
  validatePathConfig,
} from "@react-navigation/native";
import {
  AppOpenAd,
  TestIds,
  AdEventType,
  BannerAd,
  BannerAdSize,
} from "react-native-google-mobile-ads";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/actions/user";
import { setCompany } from "../store/actions/company";

const EmployeesList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const selectedItem = route?.params?.selectedItem;
  // console.log("empcom", selectedItem);

  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({});
  const user = useSelector((state) => state.userReducer.user);
  const filteredData = user.workingHours.filter((item) => {
    return item.Companyname === selectedItem.companyName;
  });
  const workers = filteredData.map((item) => {
    return item.workerName;
  });
  const sorting = [...new Set(workers)];
  const filteredList = sorting.map((item) => {
    return {
      workerName: item,
    };
  });
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUserData();
    });
    return unsubscribe;
  }, []);
  const getUserData = async () => {
    try {
      await firebase
        .firestore()
        .collection("Users")
        .doc(user.userId)
        .get()
        .then((res) => {
          let data = res.data();
          setUserData(data);
          dispatch(setUser(data));
        });
    } catch {
      (err) => {
        console.log("Error", err);
      };
    }
  };
  const deleteUserdetails = (data) => {
    Alert.alert(
      "Alert",
      `Are you sure you want to delete all details of ${data.workerName} from ${selectedItem.companyName}`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "confirm", onPress: () => deleteItem(data) },
      ]
    );
  };
  const deleteItem = async (data) => {
    let filteredHoursData = user.workingHours.filter((item) => {
      return (
        item.workerName === data.workerName &&
        item.Companyname === selectedItem.companyName
      );
    });
    let result = user.workingHours.filter(
      (item) => !filteredHoursData.includes(item)
    );
    await firebase
      .firestore()
      .collection("Users")
      .doc(user.userId)
      .update({
        workingHours: result,
      })
      .then(() => {
        getUserData();
        alert("Data deleted successfully!");
      })
      .catch((err) => {
        Alert.alert("Error", err.message);
      });
  };
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <StatusBar
        animated={true}
        backgroundColor={theme.colors.updatedColor}
        // barStyle={statusBarStyle}
      />
      <HeaderView
        onPress={() => {
          navigation.goBack();
        }}
        pageName={
          selectedItem.companyName ? selectedItem.companyName : "Employess List"
        }
      />
      <View style={{ flex: 1, backgroundColor: theme.colors.backgroundColor }}>
        <Text
          style={{
            fontFamily: "monsterRegular",
            fontSize: 16,
            paddingHorizontal: 10,
            paddingTop: 10,
            color: "gray",
          }}
        >
          All Employees / Users
        </Text>
        {filteredList.length ? (
          <FlatList
            data={filteredList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View
                style={{
                  width: "100%",
                  height: 60,
                  marginTop: 3,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setCompany(selectedItem.companyName));
                    navigation.navigate("EmployeesDetailsView", {
                      data: item,
                    });
                  }}
                  style={{
                    alignSelf: "center",
                    width: "97%",
                    borderRadius: 5,
                    backgroundColor: theme.colors.updatedColor,
                    height: 56,
                    paddingHorizontal: 10,
                    borderWidth: 0.3,
                    alignItems: "center",
                    flexDirection: "row",
                    borderColor: "gray",
                  }}
                >
                  <Image
                    source={require("../../assets/icons/building.png")}
                    style={{ width: 30, height: 30, tintColor: "white" }}
                  />

                  <Text
                    style={{
                      fontFamily: "monsterBold",
                      fontSize: 16,
                      marginLeft: 10,
                      color: "white",
                      flex: 1,
                    }}
                  >
                    {item.workerName}
                  </Text>
                  <Arrow name="keyboard-arrow-right" size={20} color="white" />
                  <Arrow
                    onPress={() => deleteUserdetails(item)}
                    // onPress={() => alert("hi")}
                    name="delete-outline"
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => item.workerName + index}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../../assets/icons/noCustomers.png")}
              style={{ height: 150, width: 300 }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontFamily: "monsterRegular",
                fontSize: 12,
                color: "gray",
              }}
            >
              No Woring Hours data found, Please add Some
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          alignItems: "center",
          backgroundColor: theme.colors.backgroundColor,
        }}
      >
        <BannerAd
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          // unitId={TestIds.BANNER}
          unitId="ca-app-pub-1446863291124897/1485050054"
          onAdLoaded={() => {
            console.log("Advert loaded");
          }}
          onAdFailedToLoad={(error) => {
            console.error("Advert failed to load: ", error);
          }}
          onAdOpened={() => {
            console.log("ad openend");
          }}
        />
      </View>
    </View>
  );
};

export default EmployeesList;
