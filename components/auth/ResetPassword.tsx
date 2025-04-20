import React, { useState } from 'react';
import { Alert, TextInput, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { supabase } from '../../lib/supabase';
import styles from './style';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleResetPassword() {
        setLoading(true);
        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            Alert.alert('Error resetting password', error.message);
        } else {
            Alert.alert('Success', 'Your password has been reset');
        }
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.card, styles.fontSize, { marginTop: 50 }]}
                onChangeText={(text) => setPassword(text)}
                value={password}
                placeholder="New Password"
                secureTextEntry
            />

            <Button buttonStyle={[styles.button, styles.mt20]} title="UPDATE PASSWORD" disabled={loading} onPress={handleResetPassword} />
        </View>
    );
}
