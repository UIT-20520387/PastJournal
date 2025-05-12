import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import UserStatusComponent from './UserStatusComponent';
import { supabase } from '../../lib/supabase'
import { UserManagementData } from './interface';
import { COLORS } from '../../constants';

interface Props {
    type: string
}

const UserManagement: React.FC<Props> = ({ type }) => {
    const [data, setData] = useState<UserManagementData | null>(null);

    useEffect(() => {
        const fetchData = async () => {

            let { data, error } = await supabase
                .rpc('get_user_management_data', {
                    type: type
                })
            if (error) console.error(error)
            else {
                // console.log(data[0].user_status_data)
                setData(data[0])
            }
        };

        const exampleUserManagementData = {
            active_users: 1500,
            banned_users: 200,
            suspended_users: 100,
            users: 1400,
            user_status_data: [
                {
                    id: 1,
                    username: "john_doe",
                    name: "John Doe",
                    email: "john@example.com",
                    phone: "+1234567890",
                    join_date: new Date("2022-01-15"),
                    birthdate: new Date("1985-05-20"),
                    image_url: "https://example.com/john.jpg",
                    status: "active"
                },
                {
                    id: 2,
                    username: "jane_smith",
                    name: "Jane Smith",
                    email: "jane@example.com",
                    phone: "+0987654321",
                    join_date: new Date("2022-03-10"),
                    birthdate: new Date("1990-10-12"),
                    image_url: "https://example.com/jane.jpg",
                    status: "active"
                },
                {
                    id: 1,
                    username: "john_doe",
                    name: "John Doe",
                    email: "john@example.com",
                    phone: "+1234567890",
                    join_date: new Date("2022-01-15"),
                    birthdate: new Date("1985-05-20"),
                    image_url: "https://example.com/john.jpg",
                    status: "active"
                },
                {
                    id: 2,
                    username: "jane_smith",
                    name: "Jane Smith",
                    email: "jane@example.com",
                    phone: "+0987654321",
                    join_date: new Date("2022-03-10"),
                    birthdate: new Date("1990-10-12"),
                    image_url: "https://example.com/jane.jpg",
                    status: "active"
                },
                {
                    id: 1,
                    username: "john_doe",
                    name: "John Doe",
                    email: "john@example.com",
                    phone: "+1234567890",
                    join_date: new Date("2022-01-15"),
                    birthdate: new Date("1985-05-20"),
                    image_url: "https://example.com/john.jpg",
                    status: "active"
                },
                {
                    id: 2,
                    username: "jane_smith",
                    name: "Jane Smith",
                    email: "jane@example.com",
                    phone: "+0987654321",
                    join_date: new Date("2022-03-10"),
                    birthdate: new Date("1990-10-12"),
                    image_url: "https://example.com/jane.jpg",
                    status: "active"
                },
                // Add more userStatusData objects as needed
            ]
        };
        // setData(exampleUserManagementData)
        fetchData();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.top}>
                <View style={styles.row}>
                    <Text style={styles.label}>Active Users:</Text>
                    <Text style={styles.content}>{data?.active_users}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Banned Users:</Text>
                    <Text style={styles.content}>{data?.banned_users}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Suspended Users:</Text>
                    <Text style={styles.content}>{data?.suspended_users}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Number of Users:</Text>
                    <Text style={styles.content}>{data?.users}</Text>
                </View>
            </View>
            <View style={styles.bottom}>
                <FlatList
                    data={data?.user_status_data}
                    renderItem={({ item }) => <UserStatusComponent data={item} />}
                    keyExtractor={item => item.id.toString()}
                    scrollEnabled={false}
                />
            </View>
        </ScrollView>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: COLORS.primary
    },
    top: {
        width: '100%',
    },
    bottom: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
    },
    content: {
        textAlign: 'right',
    }
});

export default UserManagement;
