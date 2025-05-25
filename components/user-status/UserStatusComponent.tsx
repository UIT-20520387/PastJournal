import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS, FONT, SIZES } from '../../constants';
import { supabase } from '../../lib/supabase'
import { UserStatusData } from './interface';

const UserStatusComponent: React.FC<{ data: UserStatusData }> = ({ data }) => {
    const [status, setStatus] = useState(data.status)

    const handleStatusChange = (value: string) => {
        const updateStatus = async () => {
            let { error } = await supabase
                .rpc('update_user_status', {
                    new_status: value,
                    user_id: data.id
                })
            // if (error) console.error(error)
            // else console.log(data)
        }
        setStatus(value)
        updateStatus()
    };

    const getBackgroundColor = () => {
        switch (status) {
            case 'ACTIVE':
                return COLORS.primary;
            case 'BANNED':
                return COLORS.darkRed;
            case 'SUSPENDED':
                return COLORS.gray2;
            default:
                return COLORS.primary;
        }
    };

    return (
        <View style={{ ...styles.container, backgroundColor: getBackgroundColor() }}>
            <View style={styles.top}>
                <Image source={{ uri: data.image_url }} style={styles.image} />
                <Text style={styles.name}>{data.name}</Text>
                <Picker selectedValue={status} onValueChange={handleStatusChange} style={styles.picker}>
                    <Picker.Item style={styles.pickerItem} label="ACTIVE" value="ACTIVE" />
                    <Picker.Item style={styles.pickerItem} label="BANNED" value="BANNED" />
                    <Picker.Item style={styles.pickerItem} label="SUSPENDED" value="SUSPENDED" />
                </Picker>
            </View>
            <View style={styles.bottom}>
                <View style={styles.row}>
                    <Text style={styles.label}>ID:</Text>
                    <Text style={styles.content}>{data.id}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Username:</Text>
                    <Text style={styles.content}>{data.username}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.content}>{data.email}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Phone:</Text>
                    <Text style={styles.content}>{data.phone}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Birthdate:</Text>
                    <Text style={styles.content}>{data.birthdate.toString()}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Join Date:</Text>
                    <Text style={styles.content}>{data.join_date.toString()}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primary,
        padding: 10,
        width: '100%'
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 35,
    },
    name: {
        width: '40%',
        fontFamily: FONT.bold,
        fontSize: SIZES.medium18,
        textAlign: 'left',
        textAlignVertical: 'center',
        marginLeft: 5
    },
    bottom: {
        width: '100%',
    },
    picker: {
        width: '40%',
        height: 'auto',
        borderRadius: 10,
    },
    pickerItem: {
        fontSize: SIZES.small,
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

export default UserStatusComponent;
