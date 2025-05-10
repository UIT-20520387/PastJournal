import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import BigArticleList from "../../components/article-list/BigArticleList";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Header from "../../components/header/Header";

export default function Page() {
  const [articles, setArticles] = useState(null);
  useEffect(() => {
    async function fetchData() {
      let { data, error } = await supabase.rpc(
        "get_article_list_from_category",
        {
          category_id: 1,
          user_id: 1,
        }
      );
      if (error) console.error(error);
      else setArticles(data);
    }

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: () => <Header title="Watch Later" iconvisible={false} />,
          headerTitleAlign: "center",
        }}
      />
      {/* <Text>Index page of Watch Later Tab</Text> */}
      {articles && <BigArticleList articles={articles} scrollEnabled={true} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});