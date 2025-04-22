import React, { useEffect, useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import styles from '../auth/style';
import { Button, Icon, Header } from 'react-native-elements';
import { COLORS, SIZES } from '../../constants';
import { supabase } from '../../lib/supabase';

export default function ChangePasswordModal({ modalVisible, setModalVisible }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [hidePassword, setHidePassword] = useState(true)

    const updatePassword = async () => {
        if (newPassword !== retypePassword) {
            alert("New password and retype password do not match!");
            return;
        }

        const checkPassword = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            let { data, error } = await supabase
                .rpc('check_password', {
                    user_email: user.email,
                    user_password: currentPassword
                })
            if (error) console.error(error)
            else {
                if (data) {
                    const { error } = await supabase.auth.updateUser({ password: newPassword })

                    if (error) {
                        console.error('Error updating user password:', error);
                    } else {
                        console.log('User email updated successfully');


                        let { data, error } = await supabase
                            .rpc('update_password', {
                                new_password: newPassword,
                                user_email: user.email
                            })
                        if (error) console.error(error)
                        else {
                            // Clear the TextInput fields
                            alert("Password updated successfully!");
                            setModalVisible(false);
                        }
                    }
                } else {
                    alert("Current password is not right!");
                }
            }
        }
        await checkPassword()
    };

    useEffect(() => {
        setCurrentPassword("");
        setNewPassword("");
        setRetypePassword("");
        setHidePassword(true);
    }, [modalVisible])

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={[]}>
                <Header
                    backgroundColor={COLORS.primary}
                    leftComponent={{ icon: 'arrow-back', color: 'black', size: 30, onPress: () => setModalVisible(false) }}
                    centerComponent={{ text: 'Change Password', style: { color: 'black', fontSize: SIZES.h4 } }}
                />
                <View style={styles.scrollContainer}>
                    <View style={[{ padding: 25, alignSelf: 'center' }]}>
                        <View style={[styles.card, styles.oneRow]}>
                            <TextInput
                                style={[styles.fontSize, { flex: 1 }]} // Add flex: 1 here
                                onChangeText={(text) => setCurrentPassword(text)}
                                value={currentPassword}
                                secureTextEntry={hidePassword} // This will hide the currentPassword when hidePassword is true
                                placeholder="Current Password"
                                autoCapitalize={'none'}
                            />
                            <Icon
                                style={{ alignSelf: 'center' }} // Change 'flex-end' to 'center'
                                name={hidePassword ? 'eye-slash' : 'eye'}
                                type='font-awesome'
                                onPress={() => setHidePassword(!hidePassword)}
                            />
                        </View>

                        <View style={[styles.card, styles.oneRow]}>
                            <TextInput
                                style={[styles.fontSize, { flex: 1 }]} // Add flex: 1 here
                                onChangeText={(text) => setNewPassword(text)}
                                value={newPassword}
                                secureTextEntry={hidePassword} // This will hide the newPassword when hidePassword is true
                                placeholder="New Password"
                                autoCapitalize={'none'}
                            />
                            <Icon
                                style={{ alignSelf: 'center' }} // Change 'flex-end' to 'center'
                                name={hidePassword ? 'eye-slash' : 'eye'}
                                type='font-awesome'
                                onPress={() => setHidePassword(!hidePassword)}
                            />
                        </View>

                        <View style={[styles.card, styles.oneRow]}>
                            <TextInput
                                style={[styles.fontSize, { flex: 1 }]} // Add flex: 1 here
                                onChangeText={(text) => setRetypePassword(text)}
                                value={retypePassword}
                                secureTextEntry={hidePassword} // This will hide the retypePassword when hidePassword is true
                                placeholder="Retype Password"
                                autoCapitalize={'none'}
                            />
                            <Icon
                                style={{ alignSelf: 'center' }} // Change 'flex-end' to 'center'
                                name={hidePassword ? 'eye-slash' : 'eye'}
                                type='font-awesome'
                                onPress={() => setHidePassword(!hidePassword)}
                            />
                        </View>

                        <Button buttonStyle={[styles.button, styles.mt20]} title="Update Password"
                            onPress={updatePassword}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}