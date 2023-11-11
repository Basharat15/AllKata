import React from "react";
import { View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const TimePicker = ({ isTimePickerVisible, onConfirm, onCancel }) => {
  return (
    <View>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </View>
  );
};

export default TimePicker;
