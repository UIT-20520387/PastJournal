import React from "react";
import { Stack } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import Header from "../../../components/header/Header";
import { useRouter } from "expo-router";
import { Button, Icon } from "react-native-elements";
import { supabase } from "../../../lib/supabase";
import { COLORS, SIZES, FONT } from "../../../constants";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useState, useEffect } from "react";

export default function MorePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [avatarUrl, setAvatarUrl] = useState(
    "https://eianmciufswbutirdbka.supabase.co/storage/v1/object/public/my%20files/images/icons/dollar.png?t=2024-03-03T11%3A57%3A19.836Z"
  );

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    console.log("Signed out!");
    if (error) {
      console.error("Error signing out:", error);
    } else {
      router.push("/auth");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let { data, error } = await supabase.rpc("get_basic_user_data", {
        user_email: user.email,
      });

      if (error) console.error(error);
      else {
        setEmail(data[0].email);
        setName(data[0].name);
        setAvatarUrl(data[0].avatar_url);
      }
    };
    fetchUserData();
  }, []);

  const handleEmailPress = () => {
    const email = "huyrino@gmail.com";
    const subject = "Contact Us";
    const mailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(mailUrl).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerTitle: () => <Header title="More" iconvisible={false} />,
          }}
        />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.infoContainer}>
            <Image style={styles.avatar} source={{ uri: avatarUrl }} />
            <Text style={styles.textName}>{name}</Text>
            <Text style={{ textAlign: "center" }}>{email}</Text>
          </View>
          <Button
            buttonStyle={styles.button}
            title="Edit Profile   "
            icon={<Icon name="edit" type="font-awesome" color="white" />}
            iconRight
            onPress={() => router.push("/editProfiles")}
          />
          <Button
            buttonStyle={styles.button}
            title="History   "
            icon={<Icon name="history" type="font-awesome" color="white" />}
            iconRight
            onPress={() => router.push("/history")}
          />
          <Button
            buttonStyle={styles.button}
            title="LeaderBoard   "
            icon={<Icon name="trophy" type="font-awesome" color="white" />}
            iconRight
            onPress={() => router.push("/leaderBoard")}
          />
          <Button
            buttonStyle={styles.button}
            title="Feedback   "
            icon={<Icon name="comments" type="font-awesome" color="white" />}
            iconRight
            onPress={() => router.push("/feedback")}
          />
          <Button
            buttonStyle={styles.button}
            title="Privacy and Policies, ToS  "
            icon={
              <Icon
                name="my-library-books"
                type="materialIcons"
                color="white"
              />
            }
            iconRight
            onPress={() => router.push("/privacy")}
          />
          <Button
            buttonStyle={styles.button}
            title="About us  "
            icon={<Icon name="info-circle" type="font-awesome" color="white" />}
            iconRight
            onPress={() => router.push("/privacy")}
          />

          <Button
            buttonStyle={styles.button}
            title="Rate app  "
            icon={<Icon name="star" type="font-awesome" color="white" />}
            iconRight
            onPress={() => router.push("/privacy")}
          />

          <Button
            buttonStyle={[styles.button, styles.signout]}
            title="Sign Out   "
            icon={<Icon name="sign-out" type="font-awesome" color="white" />}
            iconPosition="right"
            onPress={signOut}
          />
          <View style={styles.footer}>
            <Image
              source={require("../../../assets/adaptive-icon-hiscovery.png")}
              style={styles.logo}
            />
            <Text style={styles.footerTitle}>HisCovery</Text>
            <Text style={styles.footerText}>
              Nếu bạn có thắc mắc gì thêm, hãy liên hệ chúng tôi tại địa chỉ:
            </Text>
            <TouchableOpacity onPress={handleEmailPress}>
              <Text style={[styles.footerText, styles.email]}>
                huyrino@gmail.com
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 30, // Ensure padding to avoid clipping with the tab bar
  },
  button: {
    backgroundColor: "#c8355d",
    borderRadius: 10,
    width: "100%",
    height: "auto",
    alignSelf: "center",
    padding: 20,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  signout: {
    //marginBottom: "15%",
    marginTop: 32,
    width: "40%",
  },
  infoContainer: {
    backgroundColor: "white",
    // alignSelf: "center",
    // marginTop: 10,
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.gray,
    marginBottom: 10,
    alignSelf: "center",
  },
  textName: {
    fontFamily: FONT.bold,
    fontSize: SIZES.h3,
  },
  footer: {
    paddingVertical: 30,
    paddingHorizontal: 10,
    backgroundColor: COLORS.lightGray,
    borderTopWidth: 1,
    borderColor: "#EEEEF0",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
  footerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  footerText: {
    color: COLORS.black,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
  },
  email: {
    color: COLORS.blue,
    textDecorationLine: "underline",
  },
});
