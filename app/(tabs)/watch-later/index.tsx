import { Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import SmallArticleList from "../../../components/article-list/SmallArticleList";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import Header from "../../../components/header/Header";
import { COLORS, SIZES } from "../../../constants";
import ProtectedRoute from "../../../components/ProtectedRoute";
import React from "react";
import { useFocusEffect } from '@react-navigation/native';

export default function Page() {
  const [readerId, setReaderId] = useState<number | null>(null);
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // Function to get Reader ID
  const getId = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.rpc('get_id_by_email', {
          p_email: user.email
        });
        if (error) {
          console.error(error);
        } else {
          setReaderId(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Function to fetch articles
  const fetchArticles = useCallback(async () => {
    if (readerId !== null) {
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc("get_watch_later_list", {
          _reader_id: readerId,
        });
        if (error) {
          console.error(error);
        } else {
          setArticles(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    }
  }, [readerId]);

  // Initial fetch to get reader ID
  useEffect(() => {
    getId();
  }, [getId]);

  // Fetch articles when readerId is set
  useEffect(() => {
    if (readerId !== null) {
      fetchArticles();
    }
  }, [readerId, fetchArticles]);

  // Fetch articles when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (readerId !== null && !initialLoad) {
        fetchArticles();
      }
    }, [fetchArticles, readerId, initialLoad])
  );

  const renderArticles = () => {
    if (loading && initialLoad) {
      return <ActivityIndicator size="large" color={COLORS.darkRed} />;
    } else if (articles && articles.length > 0) {
      return <SmallArticleList key={articles.map(article => article.id).join(',')} articles={articles} />;
    } else {
      return <Text>No bookmarked articles to display. Add some bookmarked articles to watch later.</Text>;
    }
  };

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerTitle: () => <Header title="Watch Later" iconvisible={false} />,
            headerTitleAlign: "center",
          }}
        />
        {renderArticles()}
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SIZES.heightBottomNavigation,
  },
});
