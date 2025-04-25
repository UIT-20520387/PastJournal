import React, { useState } from 'react';
import { View, TouchableOpacity, Animated, Text, Image } from 'react-native';
import { supabase } from '../../lib/supabase';

interface LikeDisProps {
  comment_id: number;
}

const LikeDislikeComponent: React.FC<LikeDisProps> = (comment_id_params) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [disliked, setDisliked] = useState<boolean>(false);
  const [dislikeCount, setDislikeCount] = useState<number>(0);
  const [scaleAnim] = useState<Animated.Value>(new Animated.Value(1));
  const [userid, setUserID] = useState<number>(0);

  const { comment_id } = comment_id_params;

  const handleLikePress = () => {
    changeUserLikeDis('LIKE');
    animateButton();
  };

  const handleDislikePress = () => {
    changeUserLikeDis('DISLIKE');
    animateButton();
  };

  const getLikeDisCount = async () => {
    try {
      const { data: counts, error } = await supabase.rpc('get_like_dislike_count', { comment_id });

      if (error || !counts) {
        throw error || new Error('Like/Dislike not found.');
      }
      setDislikeCount(counts[0].dislike_count);
      setLikeCount(counts[0].like_count);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const getUserID = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession();
      if (sessionError) {
        console.log(sessionError);
        return;
      }
      if (sessionData && sessionData.user) {
        const { data: userID, error: userIDerror } = await supabase
          .from("User")
          .select("id")
          .eq("email", sessionData.user.email)
          .single();
        
        if (userIDerror || !userID) console.log(userIDerror);
        setUserID(userID.id);
        getUserLikeDis(userID.id);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
    }
  };

  const getUserLikeDis = async (userid) => {
    try {
      const { data: like_type, error } = await supabase.rpc('check_user_like_for_comment', { user_id: userid, comment_id } );

      if (error || !like_type) {
        throw error || new Error('Like/Dislike not found.');
      }
      if (like_type == "LIKE") {
        setDisliked(false);
        setLiked(true);
      }
      if (like_type == "DISLIKE") {
        setDisliked(true);
        setLiked(false);
      }
    } catch (error) {
      console.error('Error fetching user like/dislike:', error);
    }
  };

  const changeUserLikeDis = async ( likedisliketype ) => {
    try {
      const { data: like_type, error } = await supabase.rpc('change_user_like_for_comment', { user_id: userid, comment_id: comment_id, like_type: likedisliketype });

      if (error || !like_type) {
        throw error || new Error('Like/Dislike not found.');
      }
      
      getLikeDisCount();
      getUserLikeDis(userid);
    } catch (error) {
      console.error('Error fetching type:', error);
    }
  };

  React.useEffect(() => {
    getLikeDisCount();
    getUserID();
  }, [comment_id]);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={handleLikePress} activeOpacity={0.8}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Image source={ (liked? require('../../assets/icons/like_filled.png'): require('../../assets/icons/like_outline.png')) } style={{ width: 24, height: 24 }} />
        </Animated.View>
      </TouchableOpacity>
      <Text style={{ color: '#DF4771', marginHorizontal: 8 }}>{likeCount}</Text>
      <TouchableOpacity onPress={handleDislikePress} activeOpacity={0.8}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Image source={(disliked? require('../../assets/icons/dislike_filled.png'): require('../../assets/icons/dislike_outline.png')) } style={{ width: 24, height: 24 }} />
        </Animated.View>
      </TouchableOpacity>
      <Text style={{ color: '#DF4771', marginHorizontal: 8 }}>{dislikeCount}</Text>
    </View>
  );
};

export default LikeDislikeComponent;
