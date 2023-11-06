import { View, Text } from "react-native";
import React from "react";

import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import CustomSidebarMenu from "../../component/costomSlideBar";
import Home from "./Home";
import AddCompany from "./addCompany";
import AddWorker from "./addWorker";
import EmployeesList from "./EmployeesList";
import EmployeesDetailsView from "./EmployeesDetailsView";

const UserIndex = () => {
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
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Addcompany" component={AddCompany} />
      <Drawer.Screen name="AddWorker" component={AddWorker} />
      <Drawer.Screen name="EmployeesList" component={EmployeesList} />
      <Drawer.Screen
        name="EmployeesDetailsView"
        component={EmployeesDetailsView}
      />
    </Drawer.Navigator>
  );
};

export default UserIndex;
