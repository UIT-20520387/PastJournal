import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo
import { Stack, router } from "expo-router";
import ProtectedRoute from "../../components/ProtectedRoute";
import { supabase } from "../../lib/supabase";
import UpdateProfile from "../../components/profile/UpdateProfile";
import { ScrollView } from "react-native-gesture-handler";
import Header from "../../components/header/Header";

const EditProfilePage = (onClose = null) => {

    const handleBack = () => {
        router.back();
        // Handle back button press here
        // For example, navigate back to the previous screen
    };


    return (
        <ProtectedRoute>
            <View style={styles.container}>
                <SafeAreaView>
                    <Stack.Screen
                        options={{
                            headerTitle: () => <Header title="Edit Profile" iconvisible={false} />,
                        }} />
                </SafeAreaView>
                <ScrollView style={styles.content}>
                    <UpdateProfile />
                </ScrollView>
            </View>
        </ProtectedRoute>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingHorizontal: 20,
        // paddingTop: 20,
        justifyContent: "space-between",
    },
    backButton: {
        marginRight: 10,
        marginLeft: 10,
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
});

export default EditProfilePage;
