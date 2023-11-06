import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Entypo from "react-native-vector-icons/Entypo";

const MyMenu = ({ onMovePress, onDeletePress, show }) => {
  return (
    <Menu>
      <MenuTrigger>
        <View style={{ marginTop: 6 }}>
          <Entypo name="dots-three-vertical" size={17} color="black" />
        </View>
      </MenuTrigger>
      <MenuOptions>
        {show ? (
          <MenuOption onSelect={onMovePress} text="Move to Paid" />
        ) : null}
        <MenuOption onSelect={onDeletePress} text="Delete" />
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    flexDirection: "column",
  },
});
export default MyMenu;
