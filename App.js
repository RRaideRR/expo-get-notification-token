import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';

let didInit = false;

export default function App() {
  const [notificationPermission, setNotificationPermission] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState('');

  const askForExpoToken = () => {
    Notifications.getExpoPushTokenAsync({
      projectId: 'xxxx',
    }).then((token) => {
      setExpoPushToken(JSON.stringify(token))
    })
  }

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      Notifications.getPermissionsAsync().then((settings)=> {
        setNotificationPermission(settings);
        if (settings.granted) {
          askForExpoToken();
        }
      })
    }
  }, []);


  return (
    <View style={styles.container}>
      <Text>Test Notifications</Text>
      <StatusBar style="auto" />
      <Text>Current Notification Permission Status:</Text>
      <Text style={{marginTop: 20}}>{JSON.stringify(notificationPermission)}</Text>
      {!notificationPermission?.granted && (
        <Button
          title={"Grant Notification Permission"}
          onPress={() => {
            Notifications.requestPermissionsAsync().then((settings) => {
            setNotificationPermission(settings);
              if (settings.granted) {
                askForExpoToken();
              }
          })}}
        />
      )}
      <Text style={{marginTop: 40}}>Expo Push Token:</Text>
      <Text >{expoPushToken}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
