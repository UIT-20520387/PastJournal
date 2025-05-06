import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Notification } from './interface';
import { COLORS, FONT, SIZES } from '../../constants';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

const NotificationComponent: React.FC<{ notification: Notification, onDelete: (id: number) => void }> = ({ notification: initialNotification, onDelete }) => {
    const route = useRouter();
    const [notification, setNotification] = useState(initialNotification);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);

    const handleClick = () => {
        if (notification.type === 'new_article') {
            route.push('article/' + notification.source);
            readNotification();
        } else if (notification.type === 'new_comment') {
            // Handle this later
        }
    };

    const readNotification = async () => {
        let { data, error } = await supabase.rpc('read_notification', {
            p_notification_id: notification.id
        });
        if (error) {
            console.error(error);
        } else {
            // Update the notification state to mark it as read
            setNotification((prev) => ({ ...prev, is_read: true }));
        }
    };

    const handleContextMenuClick = () => {
        setContextMenuVisible(!contextMenuVisible);
    };

    const handleMarkAsRead = () => {
        readNotification();
        setContextMenuVisible(false);
    };

    const handleDelete = async () => {
        let { data, error } = await supabase.rpc('remove_notification', {
            p_notification_id: notification.id
        });
        if (error) {
            console.error(error);
        } else {
            console.log(data);
            onDelete(notification.id);
        }
        setContextMenuVisible(false);
    };

    const formatDate = (date: Date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: notification.is_read ? COLORS.white : COLORS.gray2 }]}
            onPress={handleClick}
        >
            <View style={styles.left}>
                <Image source={{ uri: notification.image_url.toString() }} style={styles.roundImage} />
            </View>
            <View style={styles.center}>
                <Text style={styles.name}>{notification.name}</Text>
                <Text style={styles.content} numberOfLines={2}>{notification.content}</Text>
                <Text style={styles.time}>{formatDate(notification.time)}</Text>
            </View>
            <TouchableOpacity style={styles.right} onPress={handleContextMenuClick}>
                <Text style={styles.more}>...</Text>
            </TouchableOpacity>
            {contextMenuVisible && (
                <View style={styles.contextMenu}>
                    <TouchableOpacity onPress={handleMarkAsRead}>
                        <Text style={styles.contextMenuItem}>Mark as read</Text>
                    </TouchableOpacity>
                    <View style={styles.separator}></View>
                    <TouchableOpacity onPress={handleDelete}>
                        <Text style={styles.contextMenuItem}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 'auto',
        flexDirection: 'row',
        paddingBottom: 5,
        paddingTop: 5,
    },
    left: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    center: {
        flex: 6,
        justifyContent: 'flex-start',
    },
    right: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    roundImage: {
        width: 80,
        height: 80,
        borderRadius: 100,
    },
    name: {
        fontFamily: FONT.bold,
        fontSize: SIZES.medium18,
    },
    content: {
        fontSize: SIZES.medium,
    },
    time: {
        fontSize: SIZES.medium,
        fontFamily: FONT.medium,
        color: 'black',
    },
    more: {
        fontSize: SIZES.xxLarge,
    },
    contextMenu: {
        position: 'absolute',
        top: 7,
        right: 40,
        backgroundColor: COLORS.gray2,
        borderRadius: 5,
        zIndex: 1,
    },
    contextMenuItem: {
        padding: 10,
        fontSize: SIZES.medium,
        color: COLORS.black,
    },
    separator: {
        width: '100%',
        backgroundColor: COLORS.gray,
        height: 1
    }
});

export default NotificationComponent;
