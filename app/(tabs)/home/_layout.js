import { Stack, Link, useRouter } from "expo-router";
import { Image, View, TextInput, TouchableOpacity } from "react-native";
import { icons, COLORS } from "../../../constants";
import { useState } from "react";

const HomeLayout = () => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleSearchIconClick = () => {
    if (isSearchVisible) {
      if (searchValue.trim() !== "") { // Check if searchValue is not empty
        // Navigate to the search page
        console.log('This is search value length', searchValue.length)
        router.push("/search/" + searchValue);
        setSearchValue(""); // Clear the search field
      }
    }
    setSearchVisible(!isSearchVisible)
  };

  return (
    <Stack
      screenOptions={{ headerShadowVisible: false, headerTitleAlign: "center" }}
    >
      <Stack.Screen
        name="(tabs-top)"
        options={{
          headerLeft: () => (
            <Link href={"/category-list"}>
              <icons.category fill={COLORS.iconColor} />
            </Link>
          ),
          headerTitle: () => (
            isSearchVisible ? (
              <TextInput
                placeholder="Search..."
                value={searchValue}
                onChangeText={text => setSearchValue(text)}
              />
            ) : (
              <Image
                source={require("../../../assets/images/logo-home.png")}
                style={{
                  width: 60,
                  height: 60,
                  resizeMode: "contain",
                }}
              />
            )
          ),

          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={handleSearchIconClick}>
                <icons.search fill={COLORS.iconColor} />
              </TouchableOpacity>
              <icons.notification fill={COLORS.iconColor} />
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="detail"
        options={{ headerTitle: "Detail", headerBackTitle: "Back" }}
      />
    </Stack>
  );
};

export default HomeLayout;
