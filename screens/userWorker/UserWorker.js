import { View, Text } from "react-native";
import React from "react";

import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import CustomSidebarMenu from "../../component/costomSlideBar";
import WorkerHome from "./workerHome";

const UserWorker = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="DrawerNavigation" component={DrawerNavigation} />
    </Drawer.Navigator>
  );
};

const DrawerNavigation = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomSidebarMenu {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Drawer.Screen name="WorkerHome" component={WorkerHome} />
      {/* <Drawer.Screen name="NewEntry" component={NewEntry} /> */}
    </Drawer.Navigator>
  );
};

export default UserWorker;
