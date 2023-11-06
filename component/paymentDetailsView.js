import { View, Text, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const PaymentDetailsView = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={1}
      style={{
        marginTop: "3%",
        width: "95%",
        borderRadius: 10,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        height: 80,
      }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          shadowColor: "#000",

          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,

          elevation: 4,

          marginLeft: "3%",
          backgroundColor: "gray",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 200,
        }}
      >
        <Image
          resizeMode="contain"
          source={props.source}
          style={{
            width: 35,
            tintColor: "white",
            height: 35,
          }}
        />
      </View>

      <Text
        style={{
          marginLeft: "3%",
          fontFamily: "monsterBold",
          fontSize: 15,
          color: "gray",
        }}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default PaymentDetailsView;
