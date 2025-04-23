import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { COLORS, SIZES } from "../../constants/theme";
import { supabase } from "../../lib/supabase";
import { Stack, router } from "expo-router";

const moveToArticleListPage = (id) => {
    // This is an empty function. Implement navigation or other actions here.
    router.navigate({
      pathname: "home",
      params: {
        idCategory: id,
      },
    });
};

const CategoryButton = ({ item }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => moveToArticleListPage(item.id)}
    >
      <View style={styles.imageContainer}>
        <ImageBackground source={{ uri: item.image_url }} style={styles.image}>
          <View style={styles.overlay} />
          <Text style={styles.text}>{item.category_name}</Text>
        </ImageBackground>
      </View>
    </TouchableOpacity>
); 

export default function CategoryList() {
    const [categories, setCategories] = useState(null);
    useEffect(() => {
      const getData = async () => {
        let { data, error } = await supabase.rpc("get_category_list");
        if (error) console.error(error);
        // else console.log(data)
  
        setCategories(data);
      };
  
      getData();
    }, []);
  
    return (
      <View style={styles.container}>
        {/* <Stack.Screen options={{ headerShown: true, title: "Category" }} /> */}
        <FlatList
          data={categories}
          renderItem={CategoryButton}
          keyExtractor={(item) => item.id}
          numColumns={2}
        />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      padding: 5,
      backgroundColor: "white",
    },
    button: {
      width: "47%",
      aspectRatio: 1,
      margin: 5,
    },
    image: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.38)",
    },
    imageContainer: {
      flex: 1,
      borderRadius: 20,
      overflow: "hidden",
    },
    text: {
      color: "white",
      textAlign: "center",
      fontSize: SIZES.large,
    },
});