import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StatusBar,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  AppOpenAd,
  TestIds,
  AdEventType,
  BannerAd,
  BannerAdSize,
} from "react-native-google-mobile-ads";
import HeaderView from "../../component/headerView";
import theme from "../../component/theme";
import { LinearGradient } from "expo-linear-gradient";
import InputText from "../../component/inputText";
import SelectDropdown from "react-native-select-dropdown";
import { RadioButton } from "react-native-paper";
import firebase from "../../libs/firebase";
import Add from "react-native-vector-icons/Ionicons";
import Warning from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/actions/user";
import Arrow from "react-native-vector-icons/MaterialIcons";
import TimePicker from "../../component/TimePicker";
import { ScrollView } from "react-native-gesture-handler";

const AddWorker = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState("Paid");
  const [workerName, setWorkerName] = useState("");
  const [BreakTime, setBreakTime] = useState("");
  const [WorkHours, setWorkHours] = useState("");
  const [wages, setWages] = useState("");
  const [workerNameDrop, setWorkerNameDropdown] = useState("");
  const [Companyname, setCompanyName] = useState("");
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({});
  const [name, setName] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const countries = ["Egypt", "Canada", "Australia", "Ireland"];
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);
  const [newWorker, setNewWorker] = useState(true);
  const [ViewType, setViewType] = useState(false);
  const [list, setList] = useState(false);
  const [startTimeModal, setStartTimeModal] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [endTimeModal, setEndTimeModal] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setWorkerName("");
      setWorkerNameDropdown("");
      setCompanyName("");
      setBreakTime("");
      setCompanyName("");
      setWorkHours("");
      setWages("");
      setStartTime("");
      setEndTime("");
      setViewType(false);
      setNewWorker(true);
      setList(false);
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
          setWorkers(data.workers);
          dispatch(setUser(data));
        });
    } catch {
      (err) => {
        console.log("Error", err);
      };
    }
  };

  const addWorkerHours = async () => {
    if (!WorkHours || !BreakTime || !Companyname || !wages) {
      alert("Please Fill all the required fields");
      return;
    } else {
      workersArray = workers.map((item) => {
        return item.workerName;
      });

      if (BreakTime > WorkHours) {
        alert("Break time can not be greater than work hours!");
        return;
      }
      let totalHours =
        value === "Paid"
          ? parseFloat(WorkHours)
          : parseFloat(WorkHours) - parseFloat(BreakTime);

      const newData = {
        grossHours: WorkHours,
        startTime: startTime,
        endTime: endTime,
        timestamp: Date.now(),
        workerName: workerNameDrop,
        Companyname: Companyname,
        BreakTime: Number(BreakTime),
        WorkHours: Number(totalHours),
        breakType: value,
        wagesPH: Number(wages),
        userId: user.userId,
        status: "unPaid",
      };
      let updatedData = [...userData.workingHours, newData];
      await firebase
        .firestore()
        .collection("Users")
        .doc(user.userId)
        .update({
          workingHours: updatedData,
        })
        .then(() => {
          Alert.alert("Updated", "Worker data updated successfully", [
            {
              text: "Okay",
              onPress: () => navigation.goBack(),
            },
          ]);
        })
        .catch((err) => {
          console.log("Error", err);
        });
    }
  };

  const addWorkerName = async () => {
    try {
      let workersArray = workers.map((item) => {
        return item.workerName;
      });
      if (workerName.length < 3) {
        alert("Please enter Full name");
        return;
      }
      if (workersArray.includes(workerName)) {
        alert("This worker name is already exists!");
        return;
      }
      {
        let newData = [
          ...workers,
          {
            timestamp: Date.now(),
            workerName: workerName,
            userId: user.userId,
          },
        ];
        await firebase
          .firestore()
          .collection("Users")
          .doc(user.userId)
          .update({
            workers: newData,
          })
          .then(() => {
            Alert.alert("Added", "Worker successfully added", [
              {
                text: "Okay",
                onPress: () => {
                  setViewType(true);
                  setWorkerName("");
                  navigation.goBack();
                },
              },
            ]);
          })
          .catch((err) => {
            console.log("Error", err);
          });
      }
    } catch {
      (e) => {
        alert(e.message);
      };
    }
  };
  const deleteWorkerAlert = (item) => {
    Alert.alert("Alert", "Are you sure you want to delete this worker?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "confirm", onPress: () => deleteWorker(item) },
    ]);
  };
  const deleteWorker = async (data) => {
    let newData = workers.filter((item) => {
      return item.timestamp !== data.timestamp;
    });
    await firebase
      .firestore()
      .collection("Users")
      .doc(user.userId)
      .update({
        workers: newData,
      })
      .then(() => {
        Alert.alert("Deleted", "Worker successfully deleted!", [
          {
            text: "Okay",
            onPress: () => {
              getUserData();
              setViewType(false);
              setList(false);
              setNewWorker(true);
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
      <StatusBar
        animated={true}
        backgroundColor={theme.colors.updatedColor}
        // barStyle={statusBarStyle}
      />
      <HeaderView pageName="Add Worker" />
      <View style={{ flex: 1, backgroundColor: theme.colors.backgroundColor }}>
        {ViewType && (
          <ScrollView showsVerticalScrollIndicator={false}>
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
                disabled={ViewType ? true : false}
                onPress={() => {
                  setViewType(true);
                  setNewWorker(false);
                  setList(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "monsterBold",
                    color: ViewType ? theme.colors.updatedColor : "gray",
                    borderBottomWidth: ViewType ? 1 : 0,
                    borderBottomColor: ViewType
                      ? theme.colors.updatedColor
                      : "gray",
                  }}
                >
                  Existing
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setNewWorker(true);
                  setViewType(false);
                  setList(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "monsterBold",
                    color: ViewType ? "gray" : theme.colors.updatedColor,
                    borderBottomWidth: ViewType ? 0 : 1,
                    borderBottomColor: ViewType
                      ? "gray"
                      : theme.colors.updatedColor,
                  }}
                >
                  New Worker / User
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setList(true);
                  setNewWorker(false);
                  setViewType(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "monsterBold",
                    color: ViewType ? "gray" : theme.colors.updatedColor,
                    borderBottomWidth: ViewType ? 0 : 1,
                    borderBottomColor: ViewType
                      ? "gray"
                      : theme.colors.updatedColor,
                  }}
                >
                  List
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ padding: 10 }}>
              {/* .........................select company................ */}
              <SelectDropdown
                onFocus={getUserData}
                buttonTextStyle={{
                  fontFamily: "monsterRegular",
                  color: "gray",
                }}
                buttonStyle={{
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  borderRadius: 10,
                  width: "100%",
                }}
                defaultButtonText="Select company"
                data={userData.companies.map((item) => item.companyName)}
                dropdownStyle={{ borderRadius: 10 }}
                rowTextStyle={{ fontFamily: "monsterRegular", color: "gray" }}
                search={true}
                searchPlaceHolder="Enter Compnay name"
                dropdownIconPosition="right"
                onSelect={(selectedItem, index) => {
                  setCompanyName(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
              {/* .................................................................................. */}
              <SelectDropdown
                onFocus={getUserData}
                buttonStyle={{
                  marginTop: 10,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  borderRadius: 10,
                  width: "100%",
                }}
                defaultButtonText={
                  workerNameDrop === "" ? "Enter worker name" : workerNameDrop
                }
                defaultValue={workerNameDrop}
                data={userData.workers.map((item) => item.workerName)}
                dropdownStyle={{ borderRadius: 10 }}
                rowTextStyle={{ fontFamily: "monsterRegular", color: "gray" }}
                buttonTextStyle={{
                  fontFamily: "monsterRegular",
                  color: "gray",
                }}
                search={true}
                searchPlaceHolder="Enter worker name"
                dropdownIconPosition="right"
                onSelect={(selectedItem, index) => {
                  // console.log(selectedItem, index);
                  setWorkerNameDropdown(selectedItem); //
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontSize: 13,
                    paddingHorizontal: 5,
                    fontStyle: "italic",
                    fontFamily: "monsterRegular",
                    color: "gray",
                    paddingTop: 5,
                  }}
                >
                  Total Hours of work
                </Text>
                <Text style={{ color: "red", padding: 5 }}> *</Text>
              </View>
              {WorkHours && (
                <Text
                  style={{
                    fontSize: 16,
                    paddingHorizontal: 5,
                    fontStyle: "italic",
                    fontFamily: "monsterBold",
                    fontWeight: "bold",
                    color: "red",
                    marginTop: -5,
                  }}
                >
                  {parseFloat(WorkHours).toFixed(2) + "  Hours"}
                </Text>
              )}
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 5,
                }}
              >
                <LinearGradient
                  // Background Linear Gradient
                  colors={[
                    theme.colors.updatedColor,
                    theme.colors.updatedColor,
                  ]}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    width: "45%",
                    height: 35,
                    borderRadius: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setStartTimeModal(true);
                    }}
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 35,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "monsterBold",
                        fontSize: 12,
                        color: "white",
                      }}
                    >
                      {!startTime
                        ? "Start Time"
                        : startTime.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>

                <LinearGradient
                  // Background Linear Gradient
                  colors={[
                    theme.colors.updatedColor,
                    theme.colors.updatedColor,
                  ]}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    width: "45%",
                    height: 35,
                    borderRadius: 10,
                    // marginTop: "2%",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setEndTimeModal(true);
                    }}
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 35,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "monsterBold",
                        fontSize: 12,
                        color: "white",
                      }}
                    >
                      {!endTime
                        ? "End Time"
                        : endTime.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
              {/* <InputText
                keyboardType="numeric"
                value={WorkHours}
                Title="Total Hours of work"
                onChangeText={(text) => setWorkHours(text)}
              /> */}
              <InputText
                keyboardType="numeric"
                value={BreakTime}
                Title="Total Break Time (optional)"
                onChangeText={(text) => setBreakTime(text)}
              />
              <InputText
                keyboardType="numeric"
                value={wages}
                placeholder="£"
                Title="wages per hour"
                onChangeText={(text) => setWages(text)}
              />

              <Text
                style={{
                  fontSize: 13,
                  paddingHorizontal: 5,
                  marginTop: 10,
                  fontStyle: "italic",
                  fontFamily: "monsterBold",
                  color: "gray",
                }}
              >
                Break Type (optional)
              </Text>

              <RadioButton.Item
                labelStyle={{ color: "gray", fontFamily: "monsterRegular" }}
                onPress={() => {
                  setValue("Paid");
                }}
                label="Paid"
                status={value === "Paid" ? "checked" : "unchecked"}
              />
              <RadioButton.Item
                labelStyle={{ color: "gray", fontFamily: "monsterRegular" }}
                fontFamily="monsterRegular"
                uncheckedColor="gray"
                onPress={() => {
                  setValue("Unpaid");
                }}
                label="Unpaid"
                status={value === "Unpaid" ? "checked" : "unchecked"}
              />

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

                  width: "100%",
                  height: 50,
                  borderRadius: 10,
                  marginTop: "2%",
                }}
              >
                <TouchableOpacity
                  onPress={addWorkerHours}
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
                    Add Hours
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
              <TimePicker
                isTimePickerVisible={startTimeModal}
                onConfirm={(time) => {
                  setStartTime(time);
                  setStartTimeModal(false);
                }}
                onCancel={() => {
                  setStartTimeModal(false);
                }}
              />
              <TimePicker
                isTimePickerVisible={endTimeModal}
                onConfirm={(time) => {
                  let differece =
                    (new Date(time) - new Date(startTime)) / 3600000;
                  if (differece <= 0) {
                    setEndTimeModal(false);
                    alert("End time cannot be less than start time!");
                    return;
                  }
                  setWorkHours(differece);
                  setEndTime(time);
                  setEndTimeModal(false);
                }}
                onCancel={() => {
                  setEndTimeModal(false);
                }}
              />
            </View>
          </ScrollView>
        )}
        {newWorker && (
          <View>
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
                onPress={() => {
                  setNewWorker(false);
                  setViewType(true);
                  setList(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "monsterBold",
                    color: newWorker ? "gray" : theme.colors.updatedColor,
                    borderBottomWidth: newWorker ? 0 : 1,
                    borderBottomColor: newWorker
                      ? "gray"
                      : theme.colors.updatedColor,
                  }}
                >
                  Existing
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={newWorker ? true : false}
                onPress={() => {
                  setViewType(false);
                  setNewWorker(true);
                  setList(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "monsterBold",
                    color: newWorker ? theme.colors.updatedColor : "gray",
                    borderBottomWidth: newWorker ? 1 : 0,
                    borderBottomColor: newWorker
                      ? theme.colors.updatedColor
                      : "gray",
                  }}
                >
                  New Worker / User
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setList(true);
                  setNewWorker(false);
                  setViewType(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "monsterBold",
                    color: newWorker ? "gray" : theme.colors.updatedColor,
                    borderBottomWidth: newWorker ? 0 : 1,
                    borderBottomColor: newWorker
                      ? "gray"
                      : theme.colors.updatedColor,
                  }}
                >
                  List
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ padding: 10 }}>
              <Text
                style={{
                  fontFamily: "monsterRegular",
                  fontSize: 12,
                  color: "gray",
                }}
              >
                Please Add Your Worker Name{" "}
                <Text style={{ color: "red" }}>*</Text>
              </Text>
              <TextInput
                onChangeText={(text) => setWorkerName(text)}
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
              ></TextInput>
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

                  width: "100%",
                  height: 50,
                  borderRadius: 10,
                  marginTop: "2%",
                }}
              >
                <TouchableOpacity
                  onPress={addWorkerName}
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
                    Add Worker
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  marginTop: "5%",
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.updatedColor,
                }}
              ></View>
              <View
                style={{
                  width: "95%",
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10%",
                }}
              >
                <Text
                  style={{
                    fontFamily: "monsterBold",
                    fontSize: 15,
                    color: "gray",
                  }}
                >
                  Company not in List?
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    fontFamily: "monsterRegular",
                    fontSize: 12,
                    color: "gray",
                  }}
                >
                  Please Add Your Comany Name{" "}
                  <Text style={{ color: "red" }}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Addcompany")}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,

                    borderRadius: 300,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 10,
                    width: 60,
                    height: 60,
                    backgroundColor: theme.colors.updatedColor,
                  }}
                >
                  <Add size={30} color="white" name="add-circle-outline" />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  marginTop: "5%",
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.updatedColor,
                }}
              ></View>

              <View
                style={{
                  height: 80,
                  marginTop: 20,
                  backgroundColor: "lightgray",
                  borderRadius: 10,
                  width: "90%",
                  alignSelf: "center",
                }}
              >
                <Warning
                  name="warning"
                  color="gray"
                  size={20}
                  style={{ alignSelf: "center", marginTop: 10 }}
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
                  Please Note: in order to register yourself or {"\n"}worker you
                  need to add your compnay first
                </Text>
              </View>
            </View>
          </View>
        )}
        {list && (
          <View>
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
                disabled={ViewType ? true : false}
                onPress={() => {
                  setNewWorker(false);
                  setViewType(true);
                  setList(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "monsterBold",
                    color: list ? "gray" : theme.colors.updatedColor,
                    borderBottomWidth: list ? 0 : 1,
                    borderBottomColor: list
                      ? "gray"
                      : theme.colors.updatedColor,
                  }}
                >
                  Existing
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setNewWorker(true);
                  setViewType(false);
                  setList(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "monsterBold",
                    color: list ? "gray" : theme.colors.updatedColor,
                    borderBottomWidth: list ? 0 : 1,
                    borderBottomColor: list
                      ? "gray"
                      : theme.colors.updatedColor,
                  }}
                >
                  New Worker / User
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={list ? true : false}
                onPress={() => {
                  setViewType(false);
                  setNewWorker(false);
                  setList(true);
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "monsterBold",
                    color: list ? theme.colors.updatedColor : "gray",
                    borderBottomWidth: list ? 1 : 0,
                    borderBottomColor: list
                      ? theme.colors.updatedColor
                      : "gray",
                  }}
                >
                  List
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ padding: 10, paddingBottom: 100 }}>
              {workers.length ? (
                <FlatList
                  data={workers}
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
                          {item.workerName}
                        </Text>

                        <Arrow
                          onPress={() => deleteWorkerAlert(item)}
                          // onPress={() => alert("hi")}
                          name="delete-outline"
                          size={20}
                          color="white"
                        />
                      </View>
                    </View>
                  )}
                  keyExtractor={(item, index) => item.workerName + index}
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
                    No Worder found, Please add Some!
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
        {/* ....................New WorkerView....................... */}
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
          unitId="ca-app-pub-1446863291124897/3443083265"
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

export default AddWorker;
