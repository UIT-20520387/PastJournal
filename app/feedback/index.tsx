import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo
import { Stack, router } from "expo-router";
import ProtectedRoute from "../../components/ProtectedRoute";
import { supabase } from "../../lib/supabase";
import Header from "../../components/header/Header";

const FeedbackPage = (onClose = null) => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [userSessionID, setUserSessionID] = useState(null);

  const handleBack = () => {
    router.back();
    // Handle back button press here
    // For example, navigate back to the previous screen
  };

  const handleSend = async () => {
    // Handle send button press here
    // For example, submit feedback to server
    if (!(subject && description)) return;

    try {
      const { data: report, error } = await supabase.rpc("add_new_report", {
        this_user_id: userSessionID || 2,
        this_description: description,
        this_subject: subject,
      });

      if (error || !report) {
        throw error || new Error("Feedback failed.");
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Error fetching Feedback:", error);
    }
  };

  const fetchData = async () => {
    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.refreshSession();
      if (sessionError) {
        console.log(sessionError);
        //redirect to SignIn
        router.push(`/auth`);
        onClose();
        return;
      }
      if (sessionData && sessionData.user) {
        let { data, error } = await supabase.rpc("get_id_by_email", {
          p_email: sessionData.user.email,
        });
        if (error) console.error(error);
        else {
          setUserSessionID(data);
          // console.log('Id here', data)
        }
      }
    } catch (error) {
      console.error("Error fetching user session:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <SafeAreaView>
          <Stack.Screen
            options={{
              headerTitle: () => <Header title="Feedback" iconvisible={false} />,
            }} />
        </SafeAreaView>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <Text style={styles.subtitle}>Chủ đề mà bạn muốn góp ý</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập chủ đề góp ý của bạn"
                value={subject}
                onChangeText={setSubject}
                multiline={true}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.subtitle}>
                Theo bạn, HisCovery cần những điểm nào cần cải thiện?
              </Text>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Nhập ý kiến của bạn"
                value={description}
                onChangeText={setDescription}
                multiline={true}
              />
            </View>
          </View>
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Gửi</Text>
          </TouchableOpacity>
        </ScrollView>

      </View>
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: "space-between",
  },
  backButton: {
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  sendButton: {
    backgroundColor: "#DF4771",
    paddingVertical: 20,
    borderRadius: 25,
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
  },
  descriptionInput: {
    height: 150,
  },
});

export default FeedbackPage;
