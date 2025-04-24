import { useRoute } from "@react-navigation/native"
import AuthorProfile from "../../components/profile/AuthorProfile"
import { Stack } from "expo-router"
import { SafeAreaView, View } from "react-native"
import Header from "../../components/header/Header";
import { COLORS } from "../../constants"
import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";

const AuthorProfilePage = () => {

    const route = useRoute()
    const { author_id } = route.params //This has compile error but can run without problem

    return (
        <ProtectedRoute>
            <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
                <Stack.Screen
                    options={{
                        headerTitle: () => <Header title="Author Profile" iconvisible={false} />,
                    }} />
                <AuthorProfile id={author_id} />
            </View>
        </ProtectedRoute>

    )
}

export default AuthorProfilePage