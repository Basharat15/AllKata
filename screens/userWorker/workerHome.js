import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import Add from "react-native-vector-icons/Ionicons";
import User from "react-native-vector-icons/AntDesign";
import Arrow from "react-native-vector-icons/MaterialIcons";
import Compeny from "react-native-vector-icons/MaterialCommunityIcons";

import { LinearGradient } from "expo-linear-gradient";

import firebase from "../../libs/firebase";
import { RadioButton } from "react-native-paper";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { async } from "@firebase/util";

import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import theme from "../../component/theme";
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const auth = getAuth();
  const db = getFirestore();
  const navigation = useNavigation();
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const [name, setName] = React.useState("");
  const [data, setData] = React.useState([]);
  const [value, setValue] = React.useState("Worker");
  const [Preview, setPreview] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectCompany, setSelctedCompany] = useState(
    "Please select a company"
  );
  const [compnayList, setCompanyList] = React.useState([]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  React.useEffect(() => {
    getCurrentUser();
    Test();
    CompaniesList();
  }, []);

  React.useEffect(() => {
    AsyncStorage.getItem("username").then((value) => {
      setName(value);
    });
  });

  const getCurrentUser = async () => {
    setLoading(true);
    await AsyncStorage.getItem("userUniqueId").then(async (res) => {
      const q = query(collection(db, "users"), where("userId", "==", res));

      const querySnapshot = await getDocs(q);

      const FullData = [];
      querySnapshot.forEach((doc) => {
        let allData = doc.data();

        allData.id = doc.id;
        FullData.push(allData);
      });
      setData(FullData);
    });
  };

  const CompaniesList = async () => {
    await AsyncStorage.getItem("userUniqueId").then(async (response) => {
      const q = query(
        collection(db, "companies")
        // where("Companyname", "==", "My company 1")
      );
      const querySnapshot = await getDocs(q);
      const CompnayData = [];
      querySnapshot.forEach((doc) => {
        const allUserData = doc.data();
        allUserData.id = doc.id;
        CompnayData.push(allUserData);
      });
      setCompanyList(CompnayData);
      // console.log(CompnayData);
    });
  };

  const Test = async () => {
    await AsyncStorage.getItem("userUniqueId").then(async (response) => {
      // const q = query(
      //   collection(db, "companies")
      //   // where("Companyname", "==", "My company 1")
      // );
      // const querySnapshot = await getDocs(q);
      // const CompnayData = [];
      // querySnapshot.forEach((doc) => {
      //   const allUserData = doc.data();
      //   allUserData.id = doc.id;
      //   CompnayData.push(allUserData);
      // });
      // // setCompanyList(CompnayData);
      // console.log(CompnayData);

      const v = query(collection(db, "users"), where("userId", "==", response));
      const querySnapshot_2 = await getDocs(v);

      const userData = [];
      querySnapshot_2.forEach((doc) => {
        const allUserData = doc.data();
        allUserData.id = doc.id;
        userData.push(allUserData);
      });
    });
  };

  // console.log(compnayList);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#E8E2E2",
        marginTop:
          Platform.OS === "android" || "ios" ? StatusBar.currentHeight : 0,
      }}
    >
      {/* {mainView} */}
      <View
        style={{
          flex: 1,
        }}
      >
        {/* {add buton view} */}

        {/* {header View} */}
        <View
          style={{
            width: width,
            height: 60,
            alignItems: "center",
            backgroundColor: "#F5F5F5",
            flexDirection: "row",
          }}
        >
          {/* {image view} */}

          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{
              width: 55,
              height: 55,
              borderRadius: 50,
            }}
          >
            <Image
              source={require("../../assets/icons/avetar.png")}
              style={{ width: 50, height: 50 }}
            />
          </TouchableOpacity>
          {/* {name View} */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 12,
                color: "gray",
                fontFamily: "monsterRegular",
              }}
            >
              Welcome
            </Text>
            <Text
              style={{
                fontFamily: "monsterBold",
                fontSize: 15,
                color: "gray",
              }}
            >
              {name}
            </Text>
          </View>
          <View
            style={{
              height: 30,
              alignItems: "center",
              marginRight: "3%",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontFamily: "monsterBold",
                fontSize: 14,
                color: "gray",
              }}
            >
              {" "}
              {value}
            </Text>

            <Arrow
              onPress={toggleModal}
              name="keyboard-arrow-down"
              size={20}
              color="white"
              style={{
                backgroundColor: "gray",
                borderRadius: 50,
                marginLeft: "3%",
              }}
            />
          </View>
        </View>
        {/*...................................... body .............................................*/}
        <View style={{ flex: 1 }}>
          {/* <LinearGradient
            // Background Linear Gradient
            colors={["lightgreen", "lightblue", "white"]}
            style={{
              marginTop: "2%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              alignSelf: "center",
              width: "95%",
              borderRadius: 10,
              height: height / 7,
            }}
          ></LinearGradient> */}
          <View
            style={{
              marginTop: "2%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              backgroundColor: "white",
              alignSelf: "center",
              width: "97%",
              padding: 10,
              borderRadius: 5,
              height: height / 1.1,
            }}
          >
            <Text
              style={{
                fontFamily: "monsterRegular",
                fontSize: 16,
                color: "gray",
              }}
            >
              Your Companies
            </Text>

            <FlatList
              data={compnayList}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: "100%",
                    height: 60,

                    marginTop: 5,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("EmployeesList", {
                        data: item,
                      })
                    }
                    style={{
                      width: "100%",
                      borderRadius: 5,
                      height: 50,
                      paddingHorizontal: 10,
                      borderWidth: 0.3,
                      alignItems: "center",
                      flexDirection: "row",
                      borderColor: "gray",
                    }}
                  >
                    <Image
                      source={require("../../assets/icons/building.png")}
                      style={{ width: 30, height: 30 }}
                    />
                    <Text
                      style={{
                        fontFamily: "monsterBold",
                        fontSize: 16,
                        marginLeft: 10,
                        color: "gray",
                        flex: 1,
                      }}
                    >
                      {item.Companyname}
                    </Text>

                    {/* <Text>{item.address}</Text> */}
                    <Arrow name="keyboard-arrow-right" size={20} color="gray" />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </View>
      {/* .............................................................................. */}
      {/* new entry page button */}
      <LinearGradient
        // Background Linear Gradient
        colors={["green", "green"]}
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          width: 60,
          height: 60,
          backgroundColor: "lightgreen",
          position: "absolute",
          bottom: height / 20,
          justifyContent: "center",
          alignItems: "center",
          right: width / 15,
          borderRadius: 50,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (Preview) {
              setPreview(false);
            } else {
              setPreview(true);
            }
          }}
          style={{
            width: 60,
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
          }}
        >
          <Add size={30} color="white" name="add-circle-outline" />
        </TouchableOpacity>
      </LinearGradient>

      {/* .............................topup view......................... */}
      {Preview == true && (
        <LinearGradient
          // Background Linear Gradient
          colors={["green", "green"]}
          style={{
            width: 70,
            height: 150,
            backgroundColor: "red",

            position: "absolute",
            alignItems: "center",
            justifyContent: "space-around",
            bottom: height / 8,
            borderRadius: 10,
            right: width / 15,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Addcompany")}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Compeny size={30} color="white" name="select-group" />
            <Text
              style={{
                fontFamily: "monsterRegular",
                fontSize: 12,
                color: "white",
              }}
            >
              Company
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("AddWorker")}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <User size={30} color="white" name="adduser" />

            <Text
              style={{
                fontFamily: "monsterRegular",
                fontSize: 12,
                color: "white",
              }}
            >
              Employee
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.modalContent, { height: height * 0.2 }]}>
            <Text>Please Selecte Your App Status</Text>
            <RadioButton.Item
              labelStyle={{ color: "gray", fontFamily: "monsterRegular" }}
              onPress={() => {
                setValue("Employer");
                navigation.replace("userIndex");
              }}
              value="Employer"
              label="Employer"
              status={value === "Employer" ? "checked" : "unchecked"}
            />
            <RadioButton.Item
              labelStyle={{ color: "gray", fontFamily: "monsterRegular" }}
              fontFamily="monsterRegular"
              uncheckedColor="gray"
              onPress={() => {
                setValue("Worker");
                navigation.replace("userWorker");
              }}
              value="Worker"
              label="Worker"
              status={value === "Worker" ? "checked" : "unchecked"}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
  },
  closeButton: {
    fontSize: 18,
    color: "white",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
});

export default Home;
