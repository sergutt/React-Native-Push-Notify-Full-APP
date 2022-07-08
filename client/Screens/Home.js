import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  View,
  Button,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { getDatabase, ref, update, onValue } from "firebase/database";
import { getAuth, updateProfile } from "firebase/auth";
import * as Device from "expo-device";
import axios from "axios";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Home = (props) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [profiledata, setProfileData] = useState({
    name: user ? user.providerData[0].displayName : "",
  });
  const [inputText, setInputText] = useState("");
  const [inputTitle, setTitleText] = useState("");
  const [expoPushToken, setExpoPushToken] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const db = getDatabase();
  const profileRef = ref(db, "profiles/" + props.userId);
  const allProfilesRef = ref(db, "profiles/");

  useEffect(() => {
    update(profileRef, {
      name: user ? user.providerData[0].displayName : "",
      token: expoPushToken ? expoPushToken : "",
    });
  });
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
  }, []);

  useEffect(() => {
    return onValue(allProfilesRef, (snapshot) => {
      if (snapshot.val() !== null) {
        const data = snapshot.val();
        let result = Object.keys(data).map((key) => data[key]);

        setAllUsers(result);
      }
    });
  });
  const signout = () => {
    props.userAuth.signOut();
  };
  const onChangeText = (text, field) => {
    setProfileData({ ...profiledata, [field]: text });
  };
  const onSubmit = () => {
    updateProfile(user, {
      displayName: profiledata.name,
    })
      .then(() => {
        console.log("successfully saved");
        console.log(user.providerData[0]);
      })
      .catch((error) => {
        console.log("error ==>", error);
      });
    update(profileRef, {
      name: profiledata.name,
    });
  };
  //
  useEffect(() => {
    if (props.userId === "") {
      props.navigation.navigate("Auth");
    }
  }, [props.userId]);
  //register for push notification
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Token is ==>", token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text> Hello from Home</Text>
      <TextInput
        placeholder="Name"
        style={styles.input}
        onChangeText={(str) => onChangeText(str, "name")}
        onBlur={() => onSubmit()}
        value={profiledata.name === null ? "" : profiledata.name}
      />
      <TextInput
        style={styles.input}
        placeholder={"Title here"}
        value={inputTitle}
        onChangeText={(text) => setTitleText(text)}
      />
      <TextInput
        style={styles.input}
        placeholder={"Text here"}
        value={inputText}
        onChangeText={(text) => setInputText(text)}
      />
      <Button onPress={signout} title="Sign Out" />
      <View>
        <FlatList
          data={allUsers}
          renderItem={({ item, index }) => (
            //  console.log({ item })

            <TouchableOpacity
              onPress={async () => {
                console.log(inputText);

                let UrlString = "localhost";
                if (Platform.OS == "android" || Platform.OS == "ios") {
                  UrlString = "192.168.1.248";
                }

                try {
                  await fetch(`http://${UrlString}:5050/notify/notification`, {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Accept-encoding": "gzip, deflate",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      token: item.token,
                      title: inputTitle,

                      body: inputText,
                    }),
                  });
                } catch (error) {
                  console.log(error);
                }
              }}
              key={index}
              style={styles.fList}
            >
              <Text style={styles.nameText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: StatusBar.currentHeight || 0,
  },
  input: {
    flexDirection: "row",
    // marginTop: -6,
    padding: 19,
    borderColor: "#ADB3BC",
    color: "#ADB3BC",
    backgroundColor: "white",
    textAlign: "left",
    width: 350,
    borderBottomWidth: 2,
  },
  fList: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  nameText: {
    color: "#000",
    fontSize: 32,
    textAlign: "center",
  },
});
