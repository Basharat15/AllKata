import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import theme from "./theme";
import { useNavigation } from "@react-navigation/native";

const HeaderView = (props) => {
  const navigation = useNavigation();
  width = Dimensions.get("window").width;
  height = Dimensions.get("window").height;
  return (
    <View
      style={{
        width: width,
        flexDirection: "row",
        height: 50,
        
        alignItems: "center",
        backgroundColor: theme.colors.headerViewColor,
      }}
    >
      <Icon
        onPress={props.onPress ? props.onPress : () => navigation.goBack()}
        name="chevron-back"
        size={30}
        color={theme.colors.updatedColor}
  
        style={{ marginLeft: 10 }}
      />
      <Text
        style={{ fontFamily: "monsterRegular", fontSize: 15, color:theme.colors.updatedColor }}
      >
        {props.pageName}
      </Text>
    </View>
  );
};

export default HeaderView;
