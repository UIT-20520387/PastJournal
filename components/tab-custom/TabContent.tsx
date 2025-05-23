import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants";
import BigArticleList from "../article-list/BigArticleList";
import { supabase } from "../../lib/supabase";

const TabContent = ({ content }) => {
  const [articles, setArticles] = useState(null);
  const [readerId, setReaderId] = useState(0);
  const [listKey, setListKey] = useState(Date.now());

  const getId = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    let { data, error } = await supabase.rpc("get_id_by_email", {
      p_email: user.email,
    });
    if (error) console.error(error);
    else {
      setReaderId(data);
    }
  };

  async function fetchData() {
    await getId();
    let { data, error } = await supabase.rpc("get_article_list_from_category", {
      category_id: content?.id,
      user_id: readerId,
    });
    console.log(data, error);
    if (error) console.error(error);
    else {
      setArticles(data);
      setListKey(Date.now()); // Update the key with a unique value (timestamp)
    }
  }
  useEffect(() => {
    fetchData();
  }, [readerId]);

  useEffect(() => {
    getId();
  }, []);

  return (
    <View style={styles.container}>
      {articles && (
        <BigArticleList
          key={listKey}
          articles={articles}
          scrollEnabled={true}
        />
      )}
    </View>
  );
};

export default TabContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
