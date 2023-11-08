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
  Modal,
  TouchableOpacity,
  Button,
  Dimensions,
  FlatList,
  Image,
  BackHandler,
  Alert,
} from "react-native";
import HeaderView from "../../component/headerView";
import theme from "../../component/theme";
import { LinearGradient } from "expo-linear-gradient";
import Add from "react-native-vector-icons/Ionicons";
import User from "react-native-vector-icons/AntDesign";
import Arrow from "react-native-vector-icons/MaterialIcons";
import Compeny from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../libs/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/actions/user";
import MyMenu from "../../component/menu";
import { setCompany } from "../store/actions/company";

const EmployeesDetailsView = ({ route }) => {
  const [wages, setTotalWages] = React.useState(0);
  const [data, setData] = React.useState([]);
  const [userData, setUserData] = useState({});
  const selectedData = route?.params.data;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);
  const [show, setShow] = useState(true);
  const [update, setUpdate] = useState(false);
  const [totalUnPaidAmount, setTotalUnPaidAmount] = useState(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [paidData, setPaidData] = useState([]);
  const [unPaidData, setUnpaidData] = useState([]);
  const [filteredWorkingData, setFilteredWorkingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const comName = useSelector((state) => state?.companyReducer.company);
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     console.log("companyDatainuseEffect", comName);
  //     getUserData();
  //   });
  //   return unsubscribe;
  // }, []);
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      dispatch(setCompany(""));
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    getUserData();
  }, [update, comName]);
  const deleteHandler = async (selectedItem) => {
    let fileteredArray = user?.workingHours.filter((item) => {
      return item.timestamp !== selectedItem.timestamp;
    });
    await firebase
      .firestore()
      .collection("Users")
      .doc(user.userId)
      .update({
        workingHours: fileteredArray,
      })
      .then(() => {
        getUserData();
        setUpdate(true);
        Alert.alert("Data deleted Successfully!");
      })
      .catch((err) => {
        Alert.alert("Error", err.message);
      });
  };
  const payHandler = async (selectedItem) => {
    let fileteredArray = user?.workingHours.filter((item) => {
      return item.timestamp !== selectedItem.timestamp;
    });
    selectedItem["status"] = "paid";
    let newData = [...fileteredArray, selectedItem];
    await firebase
      .firestore()
      .collection("Users")
      .doc(user.userId)
      .update({
        workingHours: newData,
      })
      .then(() => {
        getUserData();
        setUpdate(true);
        alert("Item moved to paid successfully!");
      })
      .catch((err) => {
        Alert.alert("Error", err.message);
      });
  };

  const calculateunPaidAmount = (data) => {
    const filteredWorkingData = data.workingHours.filter((item) => {
      return item.workerName === selectedData.workerName;
    });
    setFilteredWorkingData(filteredWorkingData);
    const paidData = filteredWorkingData.filter((item) => {
      return item.status === "paid" && item.Companyname === comName;
    });
    setPaidData(paidData);
    const unPaidData = filteredWorkingData.filter((item) => {
      return item.status === "unPaid" && item.Companyname === comName;
    });
    setUnpaidData(unPaidData);
    let totalbtPaidAmount = 0;
    let totalbtunPaidAmount = 0;
    for (let i = 0; i < unPaidData.length; i++) {
      if (unPaidData[i].breakType === "Paid") {
        let totalbtPaidHours = 0;
        totalbtPaidHours += unPaidData[i].WorkHours + unPaidData[i].BreakTime;
        totalbtPaidAmount += totalbtPaidHours * unPaidData[i].wagesPH;
      } else {
        let totalbtunPaidHours = 0;
        totalbtunPaidHours += unPaidData[i].WorkHours;
        totalbtunPaidAmount += totalbtunPaidHours * unPaidData[i].wagesPH;
      }
    }
    const totalUnPaidAmount = totalbtPaidAmount + totalbtunPaidAmount;
    setTotalUnPaidAmount(totalUnPaidAmount);
  };
  const calculatePaidAmount = (data) => {
    const filteredWorkingData = data.workingHours.filter((item) => {
      return item.workerName === selectedData.workerName;
    });
    setFilteredWorkingData(filteredWorkingData);
    const paidData = filteredWorkingData.filter((item) => {
      return item.status === "paid" && item.Companyname === comName;
    });
    setPaidData(paidData);
    const unPaidData = filteredWorkingData.filter((item) => {
      return item.status === "unPaid" && item.Companyname === comName;
    });
    setUnpaidData(unPaidData);
    let totalbtPaidAmount = 0;
    let totalbtunPaidAmount = 0;
    for (let i = 0; i < paidData.length; i++) {
      if (paidData[i].breakType === "Paid") {
        let totalbtPaidHours = 0;
        totalbtPaidHours += paidData[i].WorkHours + paidData[i].BreakTime;
        totalbtPaidAmount += totalbtPaidHours * paidData[i].wagesPH;
      } else {
        let totalbtunPaidHours = 0;
        totalbtunPaidHours += paidData[i].WorkHours;
        totalbtunPaidAmount += totalbtunPaidHours * paidData[i].wagesPH;
      }
    }
    const totalPaidAmount = totalbtPaidAmount + totalbtunPaidAmount;
    setTotalPaidAmount(totalPaidAmount);
  };
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
          calculatePaidAmount(data);
          calculateunPaidAmount(data);
          setLoading(false);
        });
    } catch {
      (err) => {
        console.log("Error", err);
      };
    }
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
          navigation.navigate("EmployeesList", {
            selectedItem: { companyName: comName },
          });
          dispatch(setCompany(""));
        }}
        pageName={
          selectedData.workerName ? selectedData.workerName : "Worker details"
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
          {selectedData.workerName}'s Working Hours
        </Text>

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
          <TouchableOpacity onPress={() => setShow(true)}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "monsterBold",
                color: show ? theme.colors.updatedColor : "gray",
                borderBottomWidth: show ? 1 : 0,
                borderBottomColor: show ? theme.colors.updatedColor : "gray",
              }}
            >
              Un Paid
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShow(false)}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "monsterBold",
                color: show ? "gray" : theme.colors.updatedColor,
                borderBottomWidth: show ? 0 : 1,
                borderBottomColor: show ? "gray" : theme.colors.updatedColor,
              }}
            >
              Paid
            </Text>
          </TouchableOpacity>
        </View>
        {show ? (
          <>
            <FlatList
              data={loading ? [] : unPaidData}
              renderItem={({ item, index }) => (
                <LinearGradient
                  // Background Linear Gradient
                  colors={["white", "white"]}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    width: "95%",
                    alignSelf: "center",
                    // height: 60,
                    marginTop: 5,
                    borderColor: theme.colors.updatedColor,
                    borderLeftWidth: 2,
                    borderBottomWidth: 2,
                    borderRadius: 10,
                  }}
                >
                  <View
                    style={{
                      width: "95%",
                      borderRadius: 10,
                      alignSelf: "center",
                      // height: 140,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "monsterRegular",
                          fontSize: 12,
                          paddingHorizontal: 5,
                          paddingTop: 10,
                          color: "gray",
                        }}
                      >
                        {new Date(item.timestamp).toLocaleDateString("en-GB")}
                        {/* {new Date(item.data).toLocaleTimeString()} */}
                      </Text>
                      <MyMenu
                        show={show}
                        onMovePress={() => {
                          Alert.alert(
                            "Alert",
                            "Are you sure you want to move this item to paid section?",
                            [
                              {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel",
                              },
                              {
                                text: "confirm",
                                onPress: () => payHandler(item),
                              },
                            ]
                          );
                        }}
                        onDeletePress={() => {
                          Alert.alert(
                            "Alert",
                            "Are you sure you want to delete this item?",
                            [
                              {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel",
                              },
                              {
                                text: "confirm",
                                onPress: () => deleteHandler(item),
                              },
                            ]
                          );
                        }}
                      />
                    </View>

                    {/* ................................................. */}
                    <View
                      style={{
                        width: "100%",
                        // height: 90,
                        marginTop: "5%",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <View style={styles.main}>
                        <Text style={styles.title}>Work Hours</Text>
                        <Text style={styles.chiled}>{item.WorkHours}</Text>
                      </View>
                      <View style={styles.main}>
                        <Text style={styles.title}>Break Time</Text>
                        <Text style={styles.chiled}>{item.BreakTime}</Text>
                      </View>
                      <View style={styles.main}>
                        <Text style={styles.title}>Wages PH</Text>
                        <Text style={styles.chiled}>£{item.wagesPH}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        alignSelf: "center",
                        marginTop: "4%",
                        width: "95%",
                        borderColor: "gray",
                        borderBottomWidth: 0.5,
                      }}
                    ></View>
                    {/* ....................................... */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 10,
                      }}
                    >
                      <Text style={styles.title}>Break Type:</Text>
                      <Text
                        style={{
                          fontFamily: "monsterBold",
                          // marginTop: "5%",
                          fontSize: 13,
                          color: "black",
                        }}
                      >
                        {item.breakType}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignSelf: "center",
                        // marginTop: "4%",
                        width: "95%",
                        borderColor: "gray",
                        borderBottomWidth: 0.5,
                      }}
                    ></View>
                    {/* ............................... */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 10,
                      }}
                    >
                      <Text style={styles.title}>Break Type:</Text>
                      <Text
                        style={{
                          fontFamily: "monsterBold",
                          // marginTop: "5%",
                          fontSize: 13,
                          color: "black",
                        }}
                      >
                        {item.breakType}
                      </Text>
                    </View>
                    {/* ......................................... */}
                    {/* <Button title="show" onPress={() => UpdateWorkerData(index,item.id)} /> */}
                  </View>
                </LinearGradient>
              )}
              keyExtractor={(item, index) => item.timestamp + index}
            />

            <View
              style={{
                width: "100%",
                height: 60,
                backgroundColor: theme.colors.updatedColor,
                borderTopRightRadius: 20,
                justifyContent: "center",
                borderTopLeftRadius: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "monsterBold",
                    // marginTop: "5%",
                    fontSize: 15,
                    color: "white",
                  }}
                >
                  Total Amount Due
                </Text>
                <Text
                  style={{
                    fontFamily: "monsterBold",
                    // marginTop: "5%",
                    fontSize: 15,
                    color: "white",
                  }}
                >
                  £{totalUnPaidAmount}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <FlatList
              data={loading ? [] : paidData}
              renderItem={({ item, index }) => (
                <LinearGradient
                  // Background Linear Gradient
                  colors={["white", "white"]}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    width: "95%",
                    alignSelf: "center",
                    // height: 60,
                    marginTop: 5,
                    borderColor: theme.colors.updatedColor,
                    borderLeftWidth: 2,
                    borderBottomWidth: 2,
                    borderRadius: 10,
                  }}
                >
                  <View
                    onPress={() => {
                      deleteHandler(item);
                    }}
                    style={{
                      width: "95%",
                      borderRadius: 10,
                      alignSelf: "center",
                      // height: 140,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "monsterRegular",
                          fontSize: 12,
                          paddingHorizontal: 5,
                          paddingTop: 10,
                          color: "gray",
                        }}
                      >
                        {new Date(item.timestamp).toLocaleDateString("en-GB")}
                        {/* {new Date(item.data).toLocaleTimeString()} */}
                      </Text>
                      <MyMenu
                        show={show}
                        onDeletePress={() => {
                          Alert.alert(
                            "Alert",
                            "Are you sure you want to delete this item?",
                            [
                              {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel",
                              },
                              {
                                text: "confirm",
                                onPress: () => deleteHandler(item),
                              },
                            ]
                          );
                        }}
                      />
                    </View>
                    {/* ................................................. */}
                    <View
                      style={{
                        width: "100%",
                        // height: 90,
                        marginTop: "5%",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <View style={styles.main}>
                        <Text style={styles.title}>Work Hours</Text>
                        <Text style={styles.chiled}>{item.WorkHours}</Text>
                      </View>
                      <View style={styles.main}>
                        <Text style={styles.title}>Break Time</Text>
                        <Text style={styles.chiled}>{item.BreakTime}</Text>
                      </View>
                      <View style={styles.main}>
                        <Text style={styles.title}>Wages PH</Text>
                        <Text style={styles.chiled}>£{item.wagesPH}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        alignSelf: "center",
                        marginTop: "4%",
                        width: "95%",
                        borderColor: "gray",
                        borderBottomWidth: 0.5,
                      }}
                    ></View>
                    {/* ....................................... */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 10,
                      }}
                    >
                      <Text style={styles.title}>Break Type:</Text>
                      <Text
                        style={{
                          fontFamily: "monsterBold",
                          // marginTop: "5%",
                          fontSize: 13,
                          color: "black",
                        }}
                      >
                        {item.breakType}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignSelf: "center",
                        // marginTop: "4%",
                        width: "95%",
                        borderColor: "gray",
                        borderBottomWidth: 0.5,
                      }}
                    ></View>
                    {/* ............................... */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 10,
                      }}
                    >
                      <Text style={styles.title}>Break Type:</Text>
                      <Text
                        style={{
                          fontFamily: "monsterBold",
                          // marginTop: "5%",
                          fontSize: 13,
                          color: "black",
                        }}
                      >
                        {item.breakType}
                      </Text>
                    </View>
                    {/* ......................................... */}
                    {/* <Button title="show" onPress={() => UpdateWorkerData(index,item.id)} /> */}
                  </View>
                </LinearGradient>
              )}
              keyExtractor={(item, index) => item.timestamp + index}
            />

            <View
              style={{
                width: "100%",
                height: 60,
                backgroundColor: theme.colors.updatedColor,
                borderTopRightRadius: 20,
                justifyContent: "center",
                borderTopLeftRadius: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "monsterBold",
                    // marginTop: "5%",
                    fontSize: 15,
                    color: "white",
                  }}
                >
                  Total Amount Due
                </Text>
                <Text
                  style={{
                    fontFamily: "monsterBold",
                    // marginTop: "5%",
                    fontSize: 15,
                    color: "white",
                  }}
                >
                  £{totalPaidAmount}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    alignItems: "center",
  },
  title: {
    fontFamily: "monsterRegular",
    fontSize: 15,
    color: theme.colors.updatedColor,
  },
  chiled: {
    fontFamily: "monsterBold",
    marginTop: "5%",
    fontSize: 13,
    color: "black",
  },
});
export default EmployeesDetailsView;
