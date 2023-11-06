import { View, Text } from "react-native";
import React from "react";
import Caret from "react-native-vector-icons/AntDesign";

const MoneyDetails = (props) => {
  return (
    <View
      style={{
        width: "90%",
        marginTop: props.marginTop,
        alignSelf: "center",
        // height: 50,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Caret
          name={props.iconName}
          color={props.iconColor}
          size={10}
          style={{ alignSelf: "center" }}
        />

        <Text
          style={{
            fontFamily: "monsterBold",
            fontSize: 12,
            marginLeft: "3%",
            color: "gray",
          }}
        >
          {props.title}
        </Text>
      </View>

      <Text
        style={{
          fontFamily: "monsterRegular",
          fontSize: 12,
          marginLeft: "10%",
          color: props.amountColor,
        }}
      >
        {props.amount}
      </Text>
    </View>
  );
};

export default MoneyDetails;
