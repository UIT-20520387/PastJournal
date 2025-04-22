import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View, TextInput, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Button, Icon } from 'react-native-elements';
import { COLORS, FONT, SIZES } from '../../constants/theme';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { validateForm } from '../../function/UserDataValidation';
import styles from '../auth/style';
import uploadImage from '../../function/UploadImage';
import ChangePasswordModal from './ChangePasswordModal';
import { formatPhoneNumber, deformatPhoneNumber } from '../../function/PhoneFormatDeformat'

export default function UpdateProfile() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [biography, setBiography] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('https://eianmciufswbutirdbka.supabase.co/storage/v1/object/public/my%20files/images/icons/dollar.png?t=2024-03-03T11%3A57%3A19.836Z');
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            // console.log("Email of current session:", user.email)
            let { data, error } = await supabase
                .rpc('get_basic_user_data', {
                    user_email: user.email
                })

            if (error) console.error(error)
            else {
                setEmail(data[0].email)
                setName(data[0].name)
                setPhone(deformatPhoneNumber(data[0].phone))
                setUsername(data[0].username)
                setAvatarUrl(data[0].avatar_url)
                setBiography(data[0].biography)
            }
        }
        fetchUserData()
    }, [])

    async function uploadAvatar() {
        const newUrl = await uploadImage("user")
        // console.log('New URL', newUrl)
        if (newUrl) {
            setAvatarUrl(newUrl)

            const upload = async () => {

                let { data, error } = await supabase
                    .rpc('update_avatar', {
                        avatar_url: newUrl,
                        user_email: email
                    })
                if (error) console.error(error)
                // else console.log(data)

            }

            upload();
        }
    }

    async function updateProfile() {
        const formData = {
            phone: phone,
            email: email,
            name: name,
            username: username
        }

        const validationResult = validateForm(formData);

        if (validationResult.isValid) {
            const { data: { user } } = await supabase.auth.getUser()

            let { data, error } = await supabase
                .rpc('update_basic_user', {
                    new_name: name,
                    new_email: email,
                    old_email: user.email,
                    new_phone: formatPhoneNumber(phone),
                    new_username: username,
                    new_biography: biography
                })

            if (error) {
                console.error(error)
            } else {
                try {
                    const { error } = await supabase.auth.updateUser({ email: email })

                    if (error) {
                        console.error('Error updating user email:', error);
                    } else {
                        // console.log('User email updated successfully');
                        Alert.alert('Update Profile Successfully');
                    }
                } catch (error) {
                    console.error('Unexpected error:', error);
                }
            }
        } else {
            // Form is invalid, display error message
            Alert.alert('Invalid Form', validationResult.message);
        }
    }

    return (
        // <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.avatar}
                    source={{ uri: avatarUrl }}
                />
                <TouchableOpacity style={styles.changeAvatar} onPress={uploadAvatar}>
                    <Text> {/* Wrap the Ionicons component with Text */}
                        <Ionicons name="pencil" size={20} color="white" />
                    </Text>
                </TouchableOpacity>
            </View>

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
            <TextInput
                style={[styles.card, styles.fontSize]}
                onChangeText={(text) => setPhone(text)}
                value={phone}
                placeholder="Phone"
                autoCapitalize={'none'}
            />
            <TextInput
                style={[styles.card, styles.fontSize]}
                onChangeText={(text) => setBiography(text)}
                value={biography}
                placeholder="Biography"
                autoCapitalize={'none'}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
            />

            <Button buttonStyle={[styles.button, styles.mt20]} title="UPDATE PROFILE" onPress={() => updateProfile()} />

            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.changePassword}>Change Password</Text>
            </TouchableOpacity>
            <ChangePasswordModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </View>
        // </ScrollView>
    )
}