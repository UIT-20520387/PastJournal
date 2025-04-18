import { Stack } from "expo-router";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import Header from "../../../components/header/Header";
import ProtectedRoute from "../../../components/ProtectedRoute";
import React, { useState, useEffect, useCallback } from "react";
import { COLORS, SIZES } from "../../../constants";
import { supabase } from "../../../lib/supabase";
import AuthorCardList from "../../../components/author-card/AuthorCardList";
import { useFocusEffect } from '@react-navigation/native';

export default function Page() {
  const [readerId, setReaderId] = useState<number | null>(null);
  const [authors, setAuthors] = useState(null);
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

  // Function to fetch followed authors
  const fetchAuthors = useCallback(async () => {
    if (readerId !== null) {
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc('get_followed_authors', {
          reader_id: readerId
        });
        if (error) {
          console.error(error);
        } else {
          setAuthors(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setInitialLoad(false)
      }
    }
  }, [readerId]);

  // Initial fetch to get reader ID
  useEffect(() => {
    getId();
  }, [getId]);

  // Fetch authors when readerId is set
  useEffect(() => {
    if (readerId !== null) {
      fetchAuthors();
    }
  }, [readerId, fetchAuthors]);

  // Fetch authors when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (readerId !== null) {
        fetchAuthors();
      }
    }, [fetchAuthors, readerId])
  );

  const renderFollowing = () => {
    if (loading && initialLoad) {
      return <ActivityIndicator size="large" color={COLORS.darkRed} />;
    } else if (authors && authors.length > 0) {
      return <AuthorCardList key={authors.map(author => author.id).join(',')} authors={authors} />;
    } else {
      return <Text>No followed authors to display. Follow some authors to read their latest articles.</Text>;
    }
  };

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerTitle: () => <Header title="Following" iconvisible={false} />,
            headerTitleAlign: "center",
          }}
        />
        {renderFollowing()}
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    marginBottom: SIZES.heightBottomNavigation,
  },
});
