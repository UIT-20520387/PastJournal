// components/auth/SignIn.tsx
import React, { useState } from 'react';
import { Alert, TextInput, TouchableOpacity, Text, ScrollView, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Button, Icon } from 'react-native-elements';
import { useRouter } from 'expo-router';
import styles from './style';
import { validateForm } from '../../function/UserDataValidation';
import { COLORS, FONT } from '../../constants/theme';

export default function SignIn({ switchComponent }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);
    const router = useRouter();

    async function signInWithEmail() {
        setLoading(true);
        const formData = {
            email: email,
            password: password,
        };

        const validationResult = validateForm(formData);

        if (validationResult.isValid) {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                Alert.alert(error.message);
            } else {
                router.replace(`/(tabs)/home`);
            }
            setLoading(false);
        } else {
            Alert.alert('Invalid Form', validationResult.message);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <TextInput
                    style={[styles.card, styles.fontSize, { marginTop: 50 }]}
                    onChangeText={setEmail}
                    value={email}
                    placeholder="Email"
                    autoCapitalize='none'
                />
                <View style={[styles.card, styles.oneRow]}>
                    <TextInput
                        style={[styles.fontSize, { flex: 1 }]}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry={hidePassword}
                        placeholder="Password"
                        autoCapitalize='none'
                    />
                    <Icon
                        style={{ alignSelf: 'center' }}
                        name={hidePassword ? 'eye-slash' : 'eye'}
                        type='font-awesome'
                        onPress={() => setHidePassword(!hidePassword)}
                    />
                </View>
                <View style={styles.formCenter}>
                    <Button
                        buttonStyle={[styles.button, styles.mt20]}
                        title="SIGN IN"
                        disabled={loading}
                        onPress={signInWithEmail}
                    />
                    <Text style={styles.mt20}>
                        Don't have an Account?
                        <TouchableOpacity disabled={loading} onPress={() => switchComponent('signUp')}>
                            <Text style={{ color: COLORS.darkRed, fontFamily: FONT.bold }}> Sign Up now!</Text>
                        </TouchableOpacity>
                    </Text>
                    <TouchableOpacity onPress={() => switchComponent('forgotPassword')}>
                        <Text style={[{ marginTop: 40 }, { fontSize: 18 }, { color: COLORS.darkRed }, { fontFamily: FONT.bold }]}>
                            Forget Password?
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.replace('/(tabs)/home')}>
                        <Text style={[{ marginTop: 40 }, { fontSize: 18 }, { color: COLORS.darkRed }, { fontFamily: FONT.bold }]}>
                            Continue without signing
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
