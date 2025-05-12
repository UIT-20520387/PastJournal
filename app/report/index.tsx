import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ProtectedRoute from "../../components/ProtectedRoute";
import { supabase } from "../../lib/supabase";

const ReportPage = ({ source_id, onClose = null }) => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [description, setDescription] = useState("");
  const [otherSubject, setOtherSubject] = useState("");
  const [userSessionID, setUserSessionID] = useState(null);

  const handleReport = async () => {
    // Handle report submission here
    console.log("Selected Subject:", selectedSubject);
    console.log("Description:", description);
    console.log("Other Subject:", otherSubject);

    try {
      const { data: report, error } = await supabase.rpc("add_new_report", {
        source_id: source_id,
        this_user_id: userSessionID || 2,
        this_description: selectedSubject || otherSubject,
        this_type: 'article',
        this_content: description,
      });

      if (error || !report) {
        throw error || new Error("Report failed.");
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Error fetching Report:", error);
    }
  };

  const fetchData = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession();
      if (sessionError) {
        console.log(sessionError);
        //redirect to SignIn
        router.push(`/auth`);
        onClose();
        return;
      }
      if (sessionData && sessionData.user) {
        let { data, error } = await supabase
          .rpc('get_id_by_email', {
            p_email: sessionData.user.email
          })
        if (error) console.error(error)
        else {
          setUserSessionID(data);
          // console.log('Id here', data)
        }
      }
    } catch (error) {
      console.error("Error fetching user session:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [source_id]);

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <SafeAreaView>
          <Stack.Screen
            options={{
              headerLeft: () => (
                <TouchableOpacity
                  onPress={onClose ? onClose : () => router.back()}
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
              ),
              headerTitle: () => <Text style={styles.title}>Report</Text>,
            }}
          />
        </SafeAreaView>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Người dùng/bài viết này có vấn đề về gì?
          </Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={selectedSubject}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedSubject(itemValue)
              }
              placeholder="Chọn một mục tiêu"
            >
              {/* <Picker.Item label="Chọn một mục tiêu" value="" /> */}
              <Picker.Item label="Ngôn từ bạo lực" value="violence_language" />
              <Picker.Item label="Xuyên tạc" value="distortion" />
              <Picker.Item label="Xúc phạm danh dự" value="insulting" />
              <Picker.Item label="Khác" value="other" />
            </Picker>
          </View>
        </View>
        {selectedSubject === "other" && (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Vui lòng mô tả mục tiêu cụ thể</Text>
            <TextInput
              style={styles.input}
              value={otherSubject}
              onChangeText={setOtherSubject}
              placeholder="Nhập mục tiêu cụ thể"
            />
          </View>
        )}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Bạn có thể mô tả rõ không?</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Mô tả vấn đề của bạn"
            multiline={true}
          />
        </View>
        <TouchableOpacity onPress={handleReport} style={styles.reportButton}>
          <Text style={styles.reportButtonText}>Báo cáo</Text>
        </TouchableOpacity>
      </View>
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginRight: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  descriptionInput: {
    height: 150,
  },
  reportButton: {
    backgroundColor: "#DF4771",
    paddingVertical: 20,
    borderRadius: 25,
    alignItems: "center",
  },
  reportButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
  },
});

export default ReportPage;
