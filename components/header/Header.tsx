import React from 'react';
import { View, Text, TouchableOpacity, FlexAlignType, ViewStyle, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

interface HeaderProps {
  title: string;
  iconvisible: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, iconvisible }) => {
  const navigator = useNavigation();
  const onLeftPress = () => {
    navigator.goBack()
  }
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
      <TouchableOpacity onPress={onLeftPress} style={styles.icon}>
        {iconvisible && <Ionicons name="arrow-back" size={24} color="black"/>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '95%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor:"yellow",
  },
  headerText: {
    // backgroundColor:"black",
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
    letterSpacing: 1,
  },
  icon: {
    position: 'absolute',
    left: 0,
    // backgroundColor:"blue",
  }
});

export default Header;
