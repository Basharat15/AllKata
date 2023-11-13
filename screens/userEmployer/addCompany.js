import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Button,
  FlatList,
  Image,
} from "react-native";
import "expo-dev-client";
import {
  AppOpenAd,
  TestIds,
  AdEventType,
  BannerAd,
  BannerAdSize,
} from "react-native-google-mobile-ads";
import Banner from "../../component/BannerAdd";
import HeaderView from "../../component/headerView";
import theme from "../../component/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import firebase from "../../libs/firebase";
import { useDispatch, useSelector } from "react-redux";
import Arrow from "react-native-vector-icons/MaterialIcons";
import { setUser } from "../store/actions/user";

const AddCompany = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);
  const [loaded, setLoaded] = useState(false);
  const [Companyname, setCompanyName] = useState("");
  const [companies, setCompanies] = useState([]);
  const [add, setAdd] = useState(true);
  const [list, setList] = useState(false);

  // [0].............................intirstital add ..........................

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setCompanyName("");
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
          setCompanies(data.companies);
          dispatch(setUser(data));
        });
    } catch {
      (err) => {
        console.log("Error", err);
      };
    }
  };
  const AddCompnay = async () => {
    try {
      let companiesArray = companies.map((item) => {
        return item.companyName;
      });
      if (Companyname.length < 5) {
        alert("Please enter a valid company name");
        return;
      }
      if (companiesArray.includes(Companyname)) {
        alert("This company is already exists!");
        return;
      }
      {
        let newData = [
          ...companies,
          {
            timestamp: Date.now(),
            companyName: Companyname,
            userId: user.userId,
          },
        ];

        await firebase
          .firestore()
          .collection("Users")
          .doc(user.userId)
          .update({
            companies: newData,
          })
          .then(() => {
            Alert.alert("Added", "Company name successfully added", [
              {
                text: "Okay",
                onPress: () => navigation.goBack(),
              },
              // interstitial.show()
            ]);
          })
          .catch((error) => {
            console.log("An error occured on adding company!", error);
          });
      }
    } catch {
      (e) => {
        alert(e.message);
      };
    }
  };
  const deleteCompanyAlert = (item) => {
    Alert.alert("Alert", "Are you sure you want to delete this company?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "confirm", onPress: () => deleteCompany(item) },
    ]);
  };
  const deleteCompany = async (data) => {
    let newData = companies.filter((item) => {
      return item.timestamp !== data.timestamp;
    });
    await firebase
      .firestore()
      .collection("Users")
      .doc(user.userId)
      .update({
        companies: newData,
      })
      .then(() => {
        Alert.alert("Deleted", "Company successfully deleted!", [
          {
            text: "Okay",
            onPress: () => {
              getUserData();
              setCompanyName("");
              navigation.goBack();
            },
          },
        ]);
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <StatusBar animated={true} backgroundColor={theme.colors.updatedColor} />
      <HeaderView pageName="Add company" />
      <View style={{ flex: 1, backgroundColor: theme.colors.backgroundColor }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "90%",
            alignSelf: "center",
            height: 50,
            borderBottomColor: "gray",
            borderBottomWidth: 0.5,
          }}
        >
          <TouchableOpacity
            disabled={add ? true : false}
            onPress={() => {
              setAdd(true);
              setList(false);
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: "monsterBold",
                color: add ? theme.colors.updatedColor : "gray",
                borderBottomWidth: add ? 1 : 0,
                borderBottomColor: add ? theme.colors.updatedColor : "gray",
              }}
            >
              New Company
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={list ? true : false}
            onPress={() => {
              setList(true);
              setAdd(false);
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: "monsterBold",
                color: list ? theme.colors.updatedColor : "gray",
                borderBottomWidth: list ? 1 : 0,
                borderBottomColor: list ? theme.colors.updatedColor : "gray",
              }}
            >
              List
            </Text>
          </TouchableOpacity>
        </View>
        {add ? (
          <View style={{ padding: 10 }}>
            <Text
              style={{
                fontFamily: "monsterRegular",
                fontSize: 12,
                color: "gray",
              }}
            >
              Please Add Your Company Name{" "}
              <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              onChangeText={(text) => setCompanyName(text)}
              value={Companyname}
              style={{
                width: "100%",
                fontFamily: "monsterRegular",
                padding: 10,
                color: "gray",
                marginTop: "2%",
                height: 50,
                borderWidth: 0.5,
                borderRadius: 10,
                borderColor: "gray",
                alignSelf: "center",
              }}
            />
            <LinearGradient
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

                width: "100%",
                height: 50,
                borderRadius: 10,
                marginTop: "2%",
              }}
            >
              <TouchableOpacity
                onPress={AddCompnay}
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
                  Add company
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ) : (
          <View style={{ padding: 10, paddingBottom: 50 }}>
            {companies.length ? (
              <FlatList
                data={companies}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      width: "100%",
                      height: 60,
                      marginTop: 3,
                    }}
                  >
                    <View
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
                        {item.companyName}
                      </Text>

                      <Arrow
                        onPress={() => deleteCompanyAlert(item)}
                        name="delete-outline"
                        size={20}
                        color="white"
                      />
                    </View>
                  </View>
                )}
                keyExtractor={(item, index) => item.companyName + index}
              />
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  height: "80%",
                }}
              >
                <Image
                  source={require("../../assets/icons/noCustomers.png")}
                  style={{ height: 150, width: 300, marginTop: "20%" }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontFamily: "monsterRegular",
                    fontSize: 12,
                    color: "gray",
                  }}
                >
                  No Company found, Please add Some!
                </Text>
              </View>
            )}
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
          unitId="ca-app-pub-1446863291124897/5877674915"
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

const styles = StyleSheet.create({
  bottomBanner: {
    position: "absolute",
    bottom: 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AddCompany;
