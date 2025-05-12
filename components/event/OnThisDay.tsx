import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS, SIZES } from '../../constants';
import { supabase } from '../../lib/supabase';

const OnThisDay = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1); // JavaScript months are 0-based
    const [day, setDay] = useState(new Date().getDate());
    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, [month, day]);

    const getData = async () => {
        let { data, error } = await supabase
            .rpc('get_events_on_this_day', {
                p_date: convertToDate(month, day)
            });
        if (error) console.error(error);
        else setData(data);
    };

    const convertToDate = (month, day) => {
        const date = new Date(2000, month - 1, day);
        return date;
    };

    const daysInMonth = (month) => {
        switch (month) {
            case 2:
                return 29;
            case 4:
            case 6:
            case 9:
            case 11:
                return 30;
            default:
                return 31;
        }
    };

    const changeDate = (delta) => {
        const currentDate = new Date(2000, month - 1, day);
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + delta);

        setMonth(newDate.getMonth() + 1);
        setDay(newDate.getDate());
    };

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>Select Month:</Text>
                    <Picker selectedValue={month} onValueChange={setMonth} style={styles.picker}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((value) => (
                            <Picker.Item key={value} label={value.toString()} value={value} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>Select Day:</Text>
                    <Picker selectedValue={day} onValueChange={setDay} style={styles.picker}>
                        {Array.from({ length: daysInMonth(month) }, (_, i) => i + 1).map((value) => (
                            <Picker.Item key={value} label={value.toString()} value={value} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={styles.navigationButtons}>
                <TouchableOpacity onPress={() => changeDate(-1)} style={styles.navButton}>
                    <Text style={styles.navButtonText}>← Previous Day</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeDate(1)} style={styles.navButton}>
                    <Text style={styles.navButtonText}>Next Day →</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottom}>
                {data === null || data.length === 0 ? (
                    <Text style={styles.noEventDataText}>No events on this day.</Text>
                ) : (
                    <>
                        <FlatList
                            data={data}
                            renderItem={({ item }) => <View style={styles.listItem}><Text>{item}</Text></View>}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <Text style={styles.source}>Nguồn: Wikipedia</Text>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        padding: '3%',
        marginBottom: SIZES.heightBottomNavigation
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        flex: 0,
    },
    pickerContainer: {
        width: '47%',
        backgroundColor: COLORS.gray,
        borderRadius: 10,
        shadowColor: COLORS.darkRed,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    picker: {
        width: '100%',
        height: 'auto',
        borderRadius: 10,
    },
    label: {
        marginLeft: 10,
        marginTop: 10,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 10,
        flex: 0,
    },
    navButton: {
        backgroundColor: COLORS.darkRed,
        borderRadius: 10,
        padding: 10,
        width: '47%',
        alignItems: 'center',
    },
    navButtonText: {
        color: COLORS.white,
        fontSize: SIZES.medium,
    },
    bottom: {
        flex: 1,
        width: '100%',
        marginTop: 10
    },
    listItem: {
        width: '98%',
        backgroundColor: COLORS.primary,
        padding: 20,
        marginVertical: 8,
        marginHorizontal: '1%',
        borderRadius: 10,
        shadowColor: COLORS.darkRed,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    noEventDataText: {
        fontSize: 18,
        color: COLORS.darkRed,
        textAlign: 'center',
        marginTop: 20,
    },
    source: {
        fontSize: SIZES.medium,
        alignSelf: 'flex-end',
        marginRight: 10,
    }
});

export default OnThisDay;
