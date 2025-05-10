// components/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../app/context/AuthContext';
import { COLORS, FONT, SIZES } from '../constants';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const { session } = useAuth();

    useEffect(() => {
        if (session === null) {
            router.push('/auth');
        }
    }, [session, router]);

    if (session === null) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Please log in to access this page.
                </Text>
                <TouchableOpacity onPress={() => router.replace('/auth')}>
                    <Text style={[{ marginTop: 40 }, { fontSize: 18 }, { color: COLORS.darkRed }, { fontFamily: FONT.bold }]}>
                        Log in now!
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return children;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: SIZES.medium,
        textAlign: 'center',
    },
});

export default ProtectedRoute;
