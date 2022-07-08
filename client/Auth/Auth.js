import React, { useEffect, useState } from "react";
import { StyleSheet, Text, Button, View, TextInput } from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Auth = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = () => {
    createUserWithEmailAndPassword(props.userAuth, email, password);
  };

  const login = () => {
    signInWithEmailAndPassword(props.userAuth, email, password);
  };

  useEffect(() => {
    console.log("the thing ====>", props.userId);
    if (props.userId !== "") {
      props.navigation.navigate("Home");
    }
  }, [props.userId]);

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} onChangeText={setEmail} value={email} />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
      />
      <Button onPress={login} title="Login" />
      <Button onPress={register} title="Register" />
    </View>
  );
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    width: 300,
    height: 40,
    marginBottom: 10,
  },
});
