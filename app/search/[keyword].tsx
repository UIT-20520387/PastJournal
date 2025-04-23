import React from 'react';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import BigArticleList from '../../components/article-list/BigArticleList'
import { TextInput, TouchableOpacity, View, StyleSheet, ScrollView, Text } from 'react-native';
import { icons, COLORS } from '../../constants';
import { Stack, useRouter } from 'expo-router';
import Header from "../../components/header/Header";
import { supabase } from "../../lib/supabase";

const SearchPage = () => {
  const router = useRouter()
  const route = useRoute();
  const { keyword } = route.params //This has compile error but can run without problem
  const decodedKeyword = decodeURIComponent(keyword);
  const [searchValue, setSearchValue] = useState('');
  const [articles, setArticles] = useState([]);
  const [readerId, setReaderId] = useState(0)
  const [isLoading, setIsLoading] = useState(true);

  const getId = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    let { data, error } = await supabase
      .rpc('get_id_by_email', {
        p_email: user.email
      })
    if (error) console.error(error)
    else {
      setReaderId(data);
      // console.log('Id here', data)
    }
  }

  const fetchArticlesByKeyword = async () => {
    const search = async () => {
      let { data, error } = await supabase
        .rpc('search_articles', {
          keyword: decodedKeyword,
          user_id: readerId
        })
      if (error) console.error(error)
      else {
        setArticles(data);
        setIsLoading(false); // Set loading state to false once data is fetched
      }
    }
    search();
  };

  useEffect(() => {
    const fetchData = async () => {
      await getId()
      await fetchArticlesByKeyword()
    }

    fetchData();
    // console.log('is bookmarked?', articles[0].is_bookmarked)
    // console.log('user id', readerId)
    // console.log('article id', articles[0].id)
  }, [])

  const handleSearch = async () => {
    // Only navigate if searchValue is not empty
    if (searchValue.trim() !== '') {
      // await setSearchValue(searchValue.replace(' ', '&'))
      router.replace("/search/" + searchValue);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerTitle: () => <Header title={"Results for \"" + decodedKeyword + "\""} iconvisible={false} />,
          }} />
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchValue}
            onChangeText={text => setSearchValue(text)}
          />
          <TouchableOpacity onPress={handleSearch}>
            <icons.search fill={COLORS.iconColor} />
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : articles.length === 0 ? (
          <Text>No articles found</Text>
        ) : (
          <BigArticleList articles={articles} scrollEnabled={false} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.primary
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    width: '70%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    margin: 10,
    shadowColor: COLORS.gray2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 100,
    elevation: 5,
  },

});

export default SearchPage;
