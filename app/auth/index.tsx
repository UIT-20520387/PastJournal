// app/auth/index.tsx
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import SignIn from '../../components/auth/SignIn';
import SignUp from '../../components/auth/SignUp';
import ForgotPassword from '../../components/auth/ForgotPassword';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
    const [currentComponent, setCurrentComponent] = useState('signIn');
    const { session } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.replace('/(tabs)/home');
        }
    }, [session, router]);

    const switchComponent = (newComponent: string) => {
        setCurrentComponent(newComponent);
    };

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen options={{ headerShown: false, statusBarHidden: true }} />
            {currentComponent === 'signIn' ? (
                <SignIn switchComponent={switchComponent} />
            ) : currentComponent === 'signUp' ? (
                <SignUp switchComponent={switchComponent} />
            ) : (
                <ForgotPassword switchComponent={switchComponent} />
            )}
        </View>
    );
}
