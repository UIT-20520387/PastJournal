import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import NotificationComponentList from '../../components/notification/NotificationComponentList';
import { COLORS } from '../../constants';
import { Notification } from '../../components/notification/interface';
import { supabase } from '../../lib/supabase';
import ProtectedRoute from '../../components/ProtectedRoute';

const NotificationsScreen: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            await fetchUserData();
            if (userId) {
                await fetchNotifications();
            }
        };
        fetch();
    }, [userId]);

    const addHours = (date: Date, hours: number) => {
        const result = new Date(date);
        result.setHours(result.getHours() + hours);
        return result;
    };

    const fetchUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data, error } = await supabase
                .rpc('get_id_by_email', { p_email: user.email });
            if (error) console.error(error);
            else setUserId(data);
        }
    };

    const fetchNotifications = async () => {
        if (userId) {
            let { data, error } = await supabase.rpc('get_notifications', {
                p_user_id: userId
            });

            if (error) {
                console.error(error);
                setError(error.message);
            } else {
                // Convert the time field to a Date object
                const formattedData = data.map((notification: Notification) => ({
                    ...notification,
                    time: addHours(new Date(notification.time), 7)
                }));
                setNotifications(formattedData);
            }
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <View style={{ flex: 1, backgroundColor: COLORS.white }}>
                <Stack.Screen
                    options={{
                        headerTitle: () => (
                            <View style={{ marginLeft: 0 }}>
                                <Text style={{ fontSize: 20, fontFamily: "InterSemiBold" }}>
                                    Notifications
                                </Text>
                            </View>
                        ),
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: COLORS.primary,
                        },
                    }}
                />
                {loading ?
                    <ActivityIndicator size="large" color={COLORS.darkRed} /> :
                    <View style={styles.container}>
                        {error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : (
                            <NotificationComponentList notifications={notifications} />
                        )}
                    </View>
                }
            </View>
        </ProtectedRoute>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorText: {
        marginTop: 20,
        fontSize: 18,
        textAlign: 'center',
        color: 'red',
    },
});

export default NotificationsScreen;
