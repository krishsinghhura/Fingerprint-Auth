import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

const App: React.FC = () => {
  const [isBiometricSupported, setIsBiometricSupported] =
    useState<boolean>(false);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const handleBiometricAuth = async () => {
    const hasBiometricRecords = await LocalAuthentication.isEnrolledAsync();

    if (!hasBiometricRecords) {
      return Alert.alert(
        "No Biometrics Found",
        "Please set up fingerprint authentication in your device settings."
      );
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate with Fingerprint",
      cancelLabel: "Cancel",
      fallbackLabel: "Use Passcode",
    });

    if (result.success) {
      setAuthenticated(true);
      Alert.alert("Success", "Authenticated successfully!");
    } else {
      Alert.alert("Failed", "Authentication failed. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {authenticated ? "Authenticated!" : "Please Authenticate"}
      </Text>
      {isBiometricSupported ? (
        <Button
          title="Authenticate with Fingerprint"
          onPress={handleBiometricAuth}
        />
      ) : (
        <Text>Biometric authentication is not supported on this device.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default App;
