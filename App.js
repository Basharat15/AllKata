import React from "react";
import { store } from "./screens/store/store";
import { Provider } from "react-redux";
import "expo-dev-client";
import { useFonts } from "expo-font";
import { MenuProvider } from "react-native-popup-menu";
import Index from "./screens/Index";
const App = () => {
  const [fontsLoaded] = useFonts({
    nyala: require("./assets/fonts/nyala.ttf"),
    monsterBold: require("./assets/fonts/Montserrat-Bold.ttf"),
    monsterRegular: require("./assets/fonts/Montserrat-Regular.ttf"),
    signature: require("./assets/fonts/signature.ttf"),
    eman: require("./assets/fonts/Eman.otf"),
  });

  if (!fontsLoaded) {
    return <React.Fragment />;
  }
  return (
    <Provider store={store}>
      <MenuProvider>
        <Index />
      </MenuProvider>
    </Provider>
  );
};
export default App;
