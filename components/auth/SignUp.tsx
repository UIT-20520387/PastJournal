//components/SignUp.tsx
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, View, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native'
import { supabase } from '../../lib/supabase'
import { Button } from 'react-native-elements'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { Icon } from 'react-native-elements';
import { useRouter } from 'expo-router'
import { validateForm } from '../../function/UserDataValidation';
import ModalCalendar from '../modal-calendar/ModalCalendar'
import styles from './style'

export default function SignUp({ switchComponent }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [birthdate, setBirthdate] = useState(new Date())
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [username, setUsername] = useState('')
    const [formattedDate, setFormattedDate] = useState(birthdate.toISOString().substring(0, 10))

    const [hidePassword, setHidePassword] = useState(true)
    const [showCalendarModal, setShowCalendarModal] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setFormattedDate(birthdate.toISOString().substring(0, 10))
    }, [birthdate])


    const handleDateChange = (date) => {
        setBirthdate(date);
        setShowCalendarModal(false);
    };

    async function signUpWithEmail() {
        const formData = {
            phone: phone,
            email: email,
            name: name,
            username: username
        }

        const validationResult = validateForm(formData);

        if (validationResult.isValid) {
            const {
                data: { session },
                error,
            } = await supabase.auth.signUp({
                email: email,
                password: password,
            })

            if (error) Alert.alert(error.message)
            else {
                let { data, error } = await supabase
                    .rpc('register_user', {
                        p_birthdate: birthdate,
                        p_email: email,
                        p_name: name,
                        p_password: password,
                        p_phone: phone,
                        p_username: username
                    })
                if (error) console.error(error)
                else {
                    router.replace('/(tabs)/home')
                }
            }
            if (!session) Alert.alert('Please check your inbox for email verification!')
        } else {
            // Form is invalid, display error message
            Alert.alert('Invalid Form', validationResult.message);
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

                <TextInput
                    style={[styles.card, styles.fontSize]}
                    onChangeText={(text) => setName(text)}
                    value={name}
                    placeholder="Full Name"
                    autoCapitalize={'words'}
                />

                <TextInput
                    style={[styles.card, styles.fontSize]}
                    onChangeText={(text) => setUsername(text)}
                    value={username}
                    placeholder="Username"
                    autoCapitalize={'none'}
                />

                <View style={[styles.card, styles.oneRow, { paddingTop: 0 }]}>
                    <Text style={[styles.fontSize, styles.mt20, { flex: 1 }, { color: COLORS.gray2 }]}>
                        {"Birth Date: " + formattedDate}</Text>

                    <Button
                        onPress={() => { setShowCalendarModal(true) }}
                        title="📅"
                    />
                </View>

                <ModalCalendar
                    visible={showCalendarModal}
                    selectedDate={birthdate}
                    onSelectDate={handleDateChange}
                />

                <TextInput
                    style={[styles.card, styles.fontSize]}
                    onChangeText={(text) => setPhone(text)}
                    value={phone}
                    placeholder="Phone"
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

                <View style={styles.formCenter}>
                    <Text style={styles.mt20}>Already have an Account?
                        <TouchableOpacity onPress={() => switchComponent('signIn')}>
                            <Text style={[{ color: COLORS.darkRed }, { fontFamily: FONT.bold }]}>  Sign In now!</Text>
                        </TouchableOpacity>
                    </Text>
                    <Button buttonStyle={[styles.button, styles.mt20]} title="SIGN UP" onPress={() => signUpWithEmail()} />
                </View>

            </View>
        </ScrollView>

    )
}
