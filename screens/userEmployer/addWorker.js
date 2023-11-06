import {
  View,
  Text,
  Platform,
  StatusBar,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import HeaderView from "../../component/headerView";
import theme from "../../component/theme";
import { LinearGradient } from "expo-linear-gradient";
import InputText from "../../component/inputText";
import SelectDropdown from "react-native-select-dropdown";
import { RadioButton } from "react-native-paper";
import firebase from "../../libs/firebase";

// firebase things
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
} from "firebase/firestore";
import { getFirestore, updateDoc } from "firebase/firestore";
import Add from "react-native-vector-icons/Ionicons";
import Warning from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/actions/user";

const AddWorker = () => {
  const navigation = useNavigation();
  const [value, setValue] = React.useState("Paid");
  const [ViewType, setViewType] = React.useState(false);
  const [workerName, setWorkerName] = useState("");
  const [BreakTime, setBreakTime] = React.useState("");
  const [WorkHours, setWorkHours] = React.useState("");
  const [wages, setWages] = React.useState("");
  const [workerNameDrop, setWorkerNameDropdown] = useState("");
  const [Companyname, setCompanyName] = React.useState("");
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({});
  const [name, setName] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const countries = ["Egypt", "Canada", "Australia", "Ireland"];
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);

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
      setViewType(false);
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
    if (
      !WorkHours.length ||
      !BreakTime.length ||
      !Companyname.length ||
      !wages.length
    ) {
      alert("Please Fill all the required fields");
      return;
    } else {
      workersArray = workers.map((item) => {
        return item.workerName;
      });
      const newData = {
        timestamp: Date.now(),
        workerName: workerNameDrop,
        Companyname: Companyname,
        BreakTime: Number(BreakTime),
        WorkHours: Number(WorkHours),
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
          <TouchableOpacity onPress={() => setViewType(true)}>
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
          <TouchableOpacity onPress={() => setViewType(false)}>
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
        </View>
        {ViewType ? (
          <View style={{ padding: 10 }}>
            {/* .........................select company................ */}
            <SelectDropdown
              onFocus={getUserData}
              buttonTextStyle={{ fontFamily: "monsterRegular", color: "gray" }}
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
              buttonTextStyle={{ fontFamily: "monsterRegular", color: "gray" }}
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
            <InputText
              keyboardType="numeric"
              value={WorkHours}
              Title="Total Hours of work"
              onChangeText={(text) => setWorkHours(text)}
            />
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
          </View>
        ) : (
          <View
            style={{ flex: 1, backgroundColor: theme.colors.backgroundColor }}
          >
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
        {/* ....................New WorkerView....................... */}
      </View>
    </View>
  );
};

export default AddWorker;
