import React from 'react';
import { Text, SafeAreaView, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import DocxReader from '../../lib/DocxReader';

import { COLORS } from '../../constants';
import CommentContainer from '../../components/comment/CommentContainer'; // Container for Comments

import { Stack } from 'expo-router';
import Header from '../../components/header/Header';


const Article = ({ article_id = 2 }) => {
  const [docxUrl, setDocxUrl] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [showComments, setShowComments] = React.useState(false);

  React.useEffect(() => {
    async function fetchDocxUrl() {
      try {
        const { data: article, error } = await supabase.rpc('get_article', { article_id: article_id });

        if (error || !article) {
          throw error || new Error('Article not found.');
        }
        setTitle(article[0].name);
        setDescription(article[0].description);
        setDocxUrl(article[0].content_url);
      } catch (error) {
        console.error('Error fetching docx URL:', error);
      }
    }

    fetchDocxUrl();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      {docxUrl ? (
        <DocxReader docxUrl={docxUrl} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      )}

      {showComments ? (
        <CommentContainer article_id={article_id} user_id={1} onClose={() => setShowComments(false)} />
      ) : (
        <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#f0f0f0',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
            }}
            onPress={() => setShowComments(true)}>
            <Image source={require('../../assets/icons/commentIcon.gif')} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
});

export default Article;