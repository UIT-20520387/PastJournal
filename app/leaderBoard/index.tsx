import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { useRouter } from "expo-router";
import { COLORS, FONT } from "../../constants";
import TopAuthorCardList from "../../components/author-card/TopAuthorCardList";
import BigArticleList from "../../components/article-list/BigArticleList"; // Import BigArticleList component
import { AuthorData } from "../../components/author-card/AuthorCard";
import { Stack, Link } from "expo-router";
import { icons } from "../../constants";
import { supabase } from "../../lib/supabase"; // assuming supabase is where you define your RPC function
import Header from "../../components/header/Header";

const LeaderBoardPage = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'topAuthor', title: 'Top Authors' },
    { key: 'topArticle', title: 'Top Articles' },
  ]);
  const [readerId, setReaderId] = useState<number | null>(null);

  const [topAuthors, setTopAuthors] = useState<any[]>([]);
  const [topArticles, setTopArticles] = useState<any[]>([]); // State for top articles

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

  useEffect(() => {
    getId();
    if (readerId) {
      if (routes[index].key === 'topAuthor') {
        fetchTopAuthors();
      } else if (routes[index].key === 'topArticle') {
        fetchTopArticles();
      }
    }
  }, [getId, readerId, routes[index].key]);


  const fetchTopAuthors = async () => {
    try {
      const { data, error } = await supabase.rpc('get_top_authors', { user_id: readerId });
      if (error) {
        console.error("Error fetching top authors:", error.message);
        return;
      }
      setTopAuthors(data);
    } catch (error) {
      console.error("Failed to fetch top authors:", error);
    }
  };

  const fetchTopArticles = async () => {
    try {
      const { data, error } = await supabase.rpc('get_top_articles', { user_id: readerId });
      if (error) {
        console.error("Error fetching top articles:", error.message);
        return;
      }
      setTopArticles(data);
    } catch (error) {
      console.error("Failed to fetch top articles:", error);
    }
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'topAuthor':
        return <TopAuthorCardList authors={topAuthors} />;
      case 'topArticle':
        return <BigArticleList articles={topArticles} scrollEnabled={true} />; // Pass topArticles to BigArticleList
      default:
        return null;
    }
  };

  const styles = StyleSheet.create({
    tabBar: {
      backgroundColor: "white",
    },
    tabText: {
      color: COLORS.textColor3,
      fontFamily: FONT.bold,
      fontSize: 14,
    },
    indicator: {
      height: 3,
    },
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      labelStyle={styles.tabText}
      activeColor={COLORS.darkRed}
      inactiveColor={COLORS.textColor3}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: () => <Header title="LeaderBoard" iconvisible={false} />,
          headerTitleAlign: "center",
        }}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

export default LeaderBoardPage;
