import React, { useState, useEffect } from "react";
import Auth from "./Auth/Auth";
import Home from "./Screens/Home";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Stack = createNativeStackNavigator();

export default function App() {
  const userAuth = getAuth();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    onAuthStateChanged(userAuth, (user) => {
      if (user !== null) setUserId(user.uid);
      else setUserId("");
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth">
          {(props) => (
            <Auth userId={userId} userAuth={userAuth} {...props}>
              Auth
            </Auth>
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Home"
          options={{
            headerShown: false,
          }}
        >
          {(props) => (
            <Home userId={userId} userAuth={userAuth} {...props}>
              Home
            </Home>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
