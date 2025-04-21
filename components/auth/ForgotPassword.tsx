import React, { useState } from 'react';
import { Alert, ScrollView, TextInput, View, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Button } from 'react-native-elements';
import { COLORS, FONT } from '../../constants/theme';
import styles from './style';

export default function ForgotPassword({ switchComponent }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    async function resetPassword() {
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'com.supabase://reset-password'
        });

        if (error) {
            Alert.alert('Error resetting password', error.message);
        } else {
            Alert.alert('Success', 'Check your email for the password reset link');
        }
        setLoading(false);
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <TextInput
                    style={[styles.card, styles.fontSize, { marginTop: 50 }]}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="Email"
                    autoCapitalize={'none'}
                />

                <View style={styles.formCenter}>
                    <Button buttonStyle={[styles.button, styles.mt20]} title="RESET PASSWORD" disabled={loading} onPress={() => resetPassword()} />
                    {/* <TouchableOpacity style={[styles.button, styles.mt20]} disabled={loading} onPress={() => resetPassword()}>
                        <Text>RESET PASSWORD</Text>
                    </TouchableOpacity> */}
                    <Text style={styles.mt20}>Remember your password?</Text>
                    <TouchableOpacity disabled={loading} onPress={() => switchComponent('signIn')}>
                        <Text style={[{ color: COLORS.darkRed }, { fontFamily: FONT.bold }]}>  Sign In now!</Text>
                    </TouchableOpacity>
                </View>
            </View >
        </ScrollView >
    )
}

