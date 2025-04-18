import { Tabs } from "expo-router";
import { View, TouchableNativeFeedback, Platform, TouchableOpacity } from "react-native"; // Import TouchableNativeFeedback
import { icons } from "../../constants";
import ProtectedRoute from "../../components/ProtectedRoute";
import React from "react";


export default function TabsLayout() {
  const TouchableComponent =
    Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity; // Determine the Touchable component based on the platform

  return (


    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#B32751",
        tabBarInactiveTintColor: "#ABABAB",
        tabBarStyle: {
          height: 55,
          paddingTop: 4,
          paddingBottom: 7,
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          elevation: 0,
          backgroundColor: "white",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          title: "Home",
          tabBarIcon: ({ color }) => <icons.house fill={color} />,
          tabBarButton: (props) => (
            <TabBarButton {...props} TouchableComponent={TouchableComponent} />
          ), // Pass TouchableComponent to TabBarButton
        }}
      />

      <Tabs.Screen
        name="watch-later"
        options={{
          tabBarLabel: "Watch Later",
          title: "Watch Later",
          tabBarIcon: ({ color }) => <icons.watchLater fill={color} />,
          tabBarButton: (props) => (
            <TabBarButton {...props} TouchableComponent={TouchableComponent} />
          ), // Pass TouchableComponent to TabBarButton
        }}
      />

      <Tabs.Screen
        name="following"
        options={{
          tabBarLabel: "Following",
          title: "Following",
          tabBarIcon: ({ color }) => <icons.following fill={color} />,
          tabBarButton: (props) => (
            <TabBarButton {...props} TouchableComponent={TouchableComponent} />
          ), // Pass TouchableComponent to TabBarButton
        }}
      />

      <Tabs.Screen
        name="widgets"
        options={{
          tabBarLabel: "On this Day",
          title: "On this day",
          tabBarIcon: ({ color }) => <icons.widgets fill={color} />,
          tabBarButton: (props) => (
            <TabBarButton {...props} TouchableComponent={TouchableComponent} />
          ), // Pass TouchableComponent to TabBarButton
        }}
      />

      <Tabs.Screen
        name="more-page"
        options={{
          tabBarLabel: "More",
          title: "More",
          tabBarIcon: ({ color }) => <icons.moreHoriz fill={color} />,
          tabBarButton: (props) => (
            <TabBarButton {...props} TouchableComponent={TouchableComponent} />
          ), // Pass TouchableComponent to TabBarButton
        }}
      />
    </Tabs>


  );
}

// Custom TabBarButton component with ripple effect
const TabBarButton = ({ children, onPress, TouchableComponent }) => {
  return (
    <TouchableComponent
      onPress={onPress}
      background={TouchableNativeFeedback.Ripple("#F1DBE2", true)}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </TouchableComponent>
  );
};
