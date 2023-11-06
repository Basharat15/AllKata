import { View, Text } from "react-native";
import React from "react";
import theme from "../component/theme";

import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";

import AuthIndex from "./auth/AuthIndex";
import UserIndex from "./userEmployer/userIndex";
import Boot from "./boot";
import UserWorker from "./userWorker/UserWorker";

const Index = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="boot" component={Boot} />
        <Stack.Screen name="AuthIndex" component={AuthIndex} />
        <Stack.Screen name="userIndex" component={UserIndex} />
        <Stack.Screen name="userWorker" component={UserWorker} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Index;
