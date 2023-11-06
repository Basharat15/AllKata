// import {
//   InterstitialAd,
//   TestIds,
//   AdEventType,
//   BannerAd,
// } from "react-native-google-mobile-ads";
// import {BannerAd} from 'react-native-google-mobile-ads';
// import { AppOpenAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';
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
} from "react-native";
import "expo-dev-client";
import Banner from "../../component/BannerAdd";
import HeaderView from "../../component/headerView";
import theme from "../../component/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import firebase from "../../libs/firebase";
import { useSelector } from "react-redux";

const AddCompany = () => {
  const user = useSelector((state) => state.userReducer.user);
  const [loaded, setLoaded] = useState(false);

  // [0].............................intirstital add ..........................

  const [Companyname, setCompanyName] = useState("");
  const [companies, setCompanies] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setCompanyName("");
      getCompanies();
    });

    return unsubscribe;
  }, []);

  const getCompanies = async () => {
    try {
      await firebase
        .firestore()
        .collection("Users")
        .doc(user.userId)
        .get()
        .then((res) => {
          let data = res.data();
          setCompanies(data.companies);
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

  // if(!loaded){
  //   return null
  // }
  // const hello=()=>{

  // interstitial.show()
  // }
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <StatusBar animated={true} backgroundColor={theme.colors.updatedColor} />
      <HeaderView pageName="Add company" />
      <View style={{ flex: 1, backgroundColor: theme.colors.backgroundColor }}>
        <View style={{ padding: 10 }}>
          <Text
            style={{
              fontFamily: "monsterRegular",
              fontSize: 12,
              color: "gray",
            }}
          >
            Please Add Your Company Name <Text style={{ color: "red" }}>*</Text>
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
