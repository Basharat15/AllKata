import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  Alert,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import Add from "react-native-vector-icons/Ionicons";
import User from "react-native-vector-icons/AntDesign";
import Arrow from "react-native-vector-icons/MaterialIcons";
import Compeny from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import firebase from "../../libs/firebase";
import theme from "../../component/theme";
import { FlatList } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

const Home = () => {
  const navigation = useNavigation();
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [value, setValue] = useState("Employer");
  const [Preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectCompany, setSelctedCompany] = useState(
    "Please select a company"
  );
  const [compnayList, setCompanyList] = useState([]);
  const [userData, setUserData] = useState({});
  const user = useSelector((state) => state.userReducer.user);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#E8E2E2",
      }}
    >
      <StatusBar
        animated={true}
        backgroundColor={theme.colors.updatedColor}
        // barStyle={statusBarStyle}
      />
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
              width: "10%",
              height: 55,
              justifyContent: "center",
              marginLeft: "4%",
              borderRadius: 50,
            }}
          >
            <Image
              resizeMode="contain"
              source={require("../../assets/drawarIcon.png")}
              style={{
                width: 20,
                height: 20,
                tintColor: theme.colors.updatedColor,
              }}
            />
          </TouchableOpacity>
          {/* {name View} */}
          <Text
            style={{
              fontSize: 15,
              alignSelf: "center",
              color: theme.colors.updatedColor,
              fontFamily: "monsterRegular",
            }}
          >
            Home
          </Text>
        </View>
        {/*...................................... body .............................................*/}
        <View
          style={{ flex: 1, backgroundColor: theme.colors.headerViewColor }}
        >
          <View
            style={{
              width: width,
              height: 100,
              backgroundColor: theme.colors.headerViewColor,
            }}
          >
            <Text
              style={{
                fontFamily: "monsterBold",
                fontSize: 20,
                marginTop: 10,
                color: theme.colors.updatedColor,
                marginLeft: "4%",
              }}
            >
              Hi,{"\n"}
              {user.username}!
            </Text>

            <Text
              style={{
                fontFamily: "monsterRegular",
                fontSize: 16,
                color: "gray",
                marginLeft: "4%",
              }}
            >
              Good Day
            </Text>
          </View>

          <View
            style={{
              width: "90%",
              overflow: "hidden",
              flexDirection: "row",
              borderRadius: 10,
              borderWidth: 2,
              borderColor: theme.colors.updatedColor,
              height: 100,
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "monsterBold",
                fontSize: 15,
                flex: 1,
                alignSelf: "center",
                color: theme.colors.updatedColor,
                marginLeft: "4%",
              }}
            >
              Welcome
              {"\n"}
              <Text
                style={{
                  fontFamily: "monsterRegular",
                  fontSize: 12,
                  color: theme.colors.updatedColor,
                  marginLeft: "4%",
                }}
              >
                Lets add companies and {"\n"}Employees details
              </Text>
            </Text>
            <Image
              resizeMode="contain"
              source={require("../../assets/addingUserIcone.png")}
              style={{
                width: 130,
                alignSelf: "flex-end",
                height: 100,
              }}
            />
          </View>

          <View
            style={{
              // backgroundColor: theme.colors.updatedColor,
              alignSelf: "center",
              width: "100%",
              padding: 10,
              borderRadius: 5,
              height: height,
              paddingBottom: 90,
            }}
          >
            <Text
              style={{
                fontFamily: "monsterRegular",
                fontSize: 16,
                color: "gray",
                marginLeft: "3%",
              }}
            >
              Your Companies:
            </Text>
            {user?.companies?.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  // justifyContent: "center",
                  // alignItems: "center",
                }}
              >
                <Image
                  resizeMode="contain"
                  source={require("../../assets/icons/noData.png")}
                  style={{
                    width: 250,
                    alignSelf: "center",
                    height: 250,
                  }}
                />
                <Text
                  style={{
                    // marginTop: 10,
                    fontFamily: "monsterRegular",
                    fontSize: 12,
                    color: "gray",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  No Companies found!{"\n"} Add some
                </Text>
              </View>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={userData.companies}
                numColumns={2}
                renderItem={({ item, index }) => (
                  <View style={{ flex: 1, width: "100%" }}>
                    <View
                      style={{
                        shadowColor: "#000",

                        width: "97%",
                        height: 150,
                        borderRadius: 10,
                        borderColor: "gray",
                        marginTop: 5,
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() =>
                          navigation.navigate("EmployeesList", {
                            selectedItem: item,
                          })
                        }
                        style={{
                          width: "100%",
                          borderRadius: 20,
                          height: 150,
                          backgroundColor: theme.colors.updatedColor,
                          paddingHorizontal: 10,
                          // borderWidth: 0.3,
                          // alignItems: "center",
                          // flexDirection: "row",
                          // borderColor: "gray",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "monsterRegular",
                              fontSize: 12,
                              marginTop: 10,
                              marginLeft: 5,
                              color: "white",
                            }}
                          >
                            Company Name:
                          </Text>
                          {/* delete button */}
                          {/* <Arrow
                          onPress={() => deleteUserdetails(index)}
                          // onPress={() => alert("hi")}
                          name="delete-outline"
                          size={35}
                          color="orange"
                        /> */}
                        </View>
                        <Text
                          style={{
                            fontFamily: "monsterBold",
                            fontSize: 14,
                            marginLeft: 5,
                            marginTop: 5,
                            color: "white",
                          }}
                        >
                          {item.companyName}
                        </Text>

                        {/* <Text>{item.address}</Text> */}
                        <Arrow
                          style={{
                            position: "absolute",
                            bottom: 10,
                            right: 10,
                          }}
                          name="keyboard-arrow-right"
                          size={20}
                          color="white"
                        />

                        <Image
                          source={require("../../assets/icons/building.png")}
                          style={{
                            width: 80,
                            height: 80,
                            tintColor: "white",
                            opacity: 0.4,
                            position: "absolute",
                            bottom: 5,
                            left: 5,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            )}

            {/* .........................all home data display............... */}
          </View>
        </View>
      </View>
      {/* .............................................................................. */}
      {/* new entry page button */}
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
            borderWidth: 1,
            borderColor: "white",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 300,
          }}
        >
          <Add size={30} color="white" name="add-circle-outline" />
        </TouchableOpacity>
      </LinearGradient>

      {/* .............................topup view......................... */}
      {Preview == true && (
        <LinearGradient
          // Background Linear Gradient
          colors={[theme.colors.updatedColor, theme.colors.updatedColor]}
          style={{
            width: 70,
            height: 150,
            backgroundColor: "red",
            borderWidth: 1,
            borderColor: "white",
            position: "absolute",
            alignItems: "center",
            justifyContent: "space-around",
            bottom: height / 8,
            borderRadius: 10,
            right: width / 15,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setPreview(false);
              navigation.navigate("Addcompany");
            }}
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
            onPress={() => {
              setPreview(false);
              navigation.navigate("AddWorker");
            }}
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

      {/* modal is currently not supprted */}
      {/* <Modal
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
      </Modal> */}
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
