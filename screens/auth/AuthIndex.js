import { View, Text } from "react-native";
import React from "react";
import Login from "./Login";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./WelcomeScreen";
import Otp from "./Otp";
import Signup from "./signup";

const AuthIndex = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="welcome"
    >
      <Stack.Screen name="welcome" component={WelcomeScreen} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="otp" component={Otp} />
      <Stack.Screen name="signup" component={Signup} />
    </Stack.Navigator>
  );
};

export default AuthIndex;
