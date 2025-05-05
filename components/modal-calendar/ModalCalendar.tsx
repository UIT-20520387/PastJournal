import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import RNPickerSelect from 'react-native-picker-select';
import { COLORS } from '../../constants/theme';

const ModalCalendar = ({ visible, selectedDate, onSelectDate }) => {
    const [selectedYear, setSelectedYear] = useState(2024);
    const [initialDate, setInitialDate] = useState('2024-03-01')
    const [calendarKey, setCalendarKey] = useState(0);

    useEffect(() => {
        if (!selectedYear) {

            setInitialDate(selectedDate.getFullYear() + '-' + selectedDate.getMonth() + '-' + selectedDate.getDay())
        }
        else {
            setInitialDate(selectedYear.toString() + '-06-01')
        }
        setCalendarKey(calendarKey + 1); // Update key to force rerender
        console.log('this is initialDate', initialDate)
    }, [selectedYear])

    const handleYearChange = (year) => {
        setSelectedYear(parseInt(year)); // Parse the year to ensure it's a number
    };

    const handleDateChange = (date) => {
        onSelectDate(new Date(date));
    };

    const yearItems = Array.from({ length: 100 }, (_, i) => ({ label: `${2024 - i}`, value: 2024 - i }));

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <RNPickerSelect
                        onValueChange={handleYearChange}
                        items={yearItems}
                        style={pickerSelectStyles}
                        placeholder={{ label: "Select a year", value: null }}
                    />
                    <Calendar
                        key={calendarKey} // Key to force rerender
                        style={styles.calendar}
                        current={initialDate}
                        onDayPress={(day) => handleDateChange(day.dateString)}
                        theme={theme}
                        markedDates={{
                            [selectedDate.toISOString().substring(0, 10)]: { selected: true }
                        }}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.gray2,
        opacity: 0.8
    },
    modalView: {
        margin: 20,
        backgroundColor: COLORS.gray,
        borderRadius: 20,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.7,
        shadowRadius: 20,
        elevation: 5
    },
    calendar: {
        padding: 15,
        width: 300,
        borderRadius: 20,
    }
});

const theme = {
    backgroundColor: COLORS.primary,
    calendarBackground: COLORS.primary,
    textSectionTitleColor: COLORS.secondary,
    selectedDayBackgroundColor: COLORS.darkRed,
    selectedDayTextColor: COLORS.primary,
    todayTextColor: COLORS.darkRed,
    dayTextColor: COLORS.secondary,
    textDisabledColor: COLORS.gray2
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        // Your styles
    },
    inputAndroid: {
        // Your styles
    },
});

export default ModalCalendar;