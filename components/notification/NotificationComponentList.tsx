import React, { useState } from 'react';
import { FlatList } from 'react-native';
import NotificationComponent from './NotificationComponent';
import { Notification } from './interface';
import { COLORS, SIZES } from '../../constants';

const NotificationComponentList: React.FC<{ notifications: Notification[] }> = ({ notifications: initialNotifications }) => {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const renderItem = ({ item }: { item: Notification }) => {
        return <NotificationComponent notification={item} onDelete={handleDelete} />;
    };

    const handleDelete = (id: number) => {
        setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.id !== id));
    };

    return (
        <FlatList
            style={{ flex: 1, backgroundColor: COLORS.background, margin: 0, padding: 0 }}
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
        />
    );
};

export default NotificationComponentList;
