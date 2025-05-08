import { Alert, ScrollView, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { supabase } from '../../lib/supabase'
import { Button } from 'react-native-elements'
import { useState } from 'react';
import { Icon } from 'react-native-elements';
import { COLORS, FONT } from '../../constants';
import styles from '../../components/auth/style';
import { router } from 'expo-router';
import { validateForm } from '../../function/UserDataValidation';
import React from 'react';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('')
    const [hidePassword, setHidePassword] = useState(true)
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    async function updatePassword() {
        if (password !== passwordConfirmation) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        const formData = {
            email: email,
            password: password,
        };

        const validationResult = validateForm(formData);

        if (validationResult.isValid) {
            // Fetch the user data using the email
            const { data: userData, error: userError } = await supabase
                .from('User')
                .select('password')
                .eq('email', email)
                .single();

            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: userData.password,
            });

            if (error) {
                Alert.alert(error.message);
            } else {
                const { data, error } = await supabase.auth.updateUser({
                    password: password
                })

                if (error) {
                    Alert.alert('Error resetting password', error.message);
                } else {
                    // Update the password in the User table
                    const { error: updateUserError } = await supabase
                        .from('User')
                        .update({ password: password })
                        .eq('email', email);

                    if (updateUserError) {
                        Alert.alert('Error updating user password', updateUserError.message);
                    } else {
                        Alert.alert('Success', 'User password has been updated in the User table');
                        router.replace(`/(tabs)/home`);
                    }
                }
            }
        } else {
            Alert.alert('Invalid Input Data', validationResult.message);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <TextInput
                    style={[styles.card, styles.fontSize]}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="Email"
                    autoCapitalize={'none'}
                />

                <View style={[styles.card, styles.oneRow]}>
                    <TextInput
                        style={[styles.fontSize, { flex: 1 }]} // Add flex: 1 here
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={hidePassword} // This will hide the password when hidePassword is true
                        placeholder="Password"
                        autoCapitalize={'none'}
                    />
                    <Icon
                        style={{ alignSelf: 'center' }}
                        name={hidePassword ? 'eye-slash' : 'eye'}
                        type='font-awesome'
                        onPress={() => setHidePassword(!hidePassword)}
                    />
                </View>

                <View style={[styles.card, styles.oneRow]}>
                    <TextInput
                        style={[styles.fontSize, { flex: 1 }]} // Add flex: 1 here
                        onChangeText={(text) => setPasswordConfirmation(text)}
                        value={passwordConfirmation}
                        secureTextEntry={hidePassword} // This will hide the password when hidePassword is true
                        placeholder="Password"
                        autoCapitalize={'none'}
                    />
                    <Icon
                        style={{ alignSelf: 'center' }}
                        name={hidePassword ? 'eye-slash' : 'eye'}
                        type='font-awesome'
                        onPress={() => setHidePassword(!hidePassword)}
                    />
                </View>

                <View style={styles.formCenter}>
                    <Text style={styles.mt20}>Already have an Account?
                        <TouchableOpacity onPress={() => router.replace('/auth')}>
                            <Text style={[{ color: COLORS.darkRed }, { fontFamily: FONT.bold }]}>  Sign In now!</Text>
                        </TouchableOpacity>
                    </Text>
                    <Button buttonStyle={[styles.button, styles.mt20]} title="UPDATE PASSWORD" onPress={() => updatePassword()} />
                </View>

            </View>
        </ScrollView>

    );
}
