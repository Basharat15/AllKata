import { View, Text, TextInput } from "react-native";
import React from "react";

const InputText = (props) => {
  return (
    <View
      style={{
        width: props.ViewWidth ? props.ViewWidth : "100%",
        height: 75,
        padding: 5,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            fontSize: 13,
            paddingHorizontal: 5,
            fontStyle: "italic",
            fontFamily: "monsterRegular",
            color: "gray",
          }}
        >
          {props.Title}
        </Text>
        <Text style={{ color: "red" }}> *</Text>
      </View>
      <TextInput
        editable={props.editable}
        keyboardType={props.keyboardType}
        clearButtonMode="always"
        value={props.value}
        ref={props.ref}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        style={{
          height: 40,
          width: props.width,
          borderWidth: 0.5,
          padding: 10,
          fontSize: 14,
          fontFamily: "monsterRegular",
          marginTop: 5,
          borderColor: props.borderColor ? props.borderColor : "gray",
          borderRadius: 5,
        }}
      />
    </View>
  );
};

export default InputText;
